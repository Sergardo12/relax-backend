import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { PAGO_CITA_REPOSITORY_TOKEN } from '../../infrastructure/pago-cita.repository.token';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { PagoCitaService } from '../services/pago-cita.service';
import { MetodoPagoCita } from '../../domain/enums/metodo-pago-cita.enum';
import { EstadoPagoCita } from '../../domain/enums/estado-pago-cita.enum';
import { PagarConTarjetaDto } from '../../infrastructure/dto/pagar-con-tarjeta.dto';
import { EstadoPago } from 'src/modules/cita/domain/enums/cita.enum';

@Injectable()
export class PagarConTarjetaUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    private readonly pagoCitaService: PagoCitaService,
  ) {}

  async execute(dto: PagarConTarjetaDto): Promise<Result<PagoCita>> {
    try {
      console.log('🔍 1. DTO recibido:', dto);
      const { idCita, token, email } = dto;

      // Validar que la cita existe
       console.log('🔍 2. Buscando cita...');
      const citaResult = await this.citaRepository.findById(idCita);
       console.log('🔍 3. Cita result:', citaResult.ok);

      if (!citaResult.ok) {
        console.log('❌ Cita no encontrada');
        return Result.failure(`Error al buscar la cita: ${citaResult.message}`);
      }

      const cita = citaResult.value;
      console.log('✅ 4. Cita encontrada:', cita?.getId());
      if (!cita) {
        return Result.failure('La cita no existe');
      }

      // Validar que la cita NO está pagada
      console.log('🔍 5. Estado pago actual:', cita.getEstadoPago());
      if (cita.getEstadoPago() === EstadoPago.PAGADO) {
        console.log('❌ Ya está pagada');
        return Result.failure('La cita ya está pagada');
      }

      console.log('🔍 6. Calculando monto...');
      // Calcular monto total
      const montoTotal = await this.pagoCitaService.calcularMontoTotal(idCita);
      console.log('✅ 7. Monto total:', montoTotal);

      console.log('🔍 8. Creando cargo en Culqi...');
      console.log('Token:', token);
      console.log('Monto:', montoTotal);
      console.log('Email:', email);
      
       

      // Crear cargo en Culqi
      const culqiResponse = await this.pagoCitaService.crearCargoTarjeta(
        token,
        montoTotal,
        email,
        idCita,
      );
      console.log('✅ 9. Respuesta de Culqi:', culqiResponse);

      // Verificar resultado del pago
      if (culqiResponse.outcome.type === 'venta_exitosa') {
        // Crear PagoCita con estado EXITOSO
        const pagoCita = new PagoCita({
          cita,
          culqiChargeId: culqiResponse.id,
          culqiToken: token,
          metodoPago: MetodoPagoCita.TARJETA,
          montoTotal,
          estado: EstadoPagoCita.EXITOSO,
          culqiResponse,
        });

        const createResult = await this.pagoCitaRepository.create(pagoCita);
        if (!createResult.ok) {
          return Result.failure(
            `Error al registrar el pago: ${createResult.message}`,
          );
        }

        // Actualizar estado de pago de la cita
        cita.marcarComoPagada();
        await this.citaRepository.update(idCita, cita);

        return Result.success(createResult.value);
      } else {
        // Crear PagoCita con estado FALLIDO
        const mensajeError =
          culqiResponse.outcome.user_message || 'Error desconocido en el pago';

        const pagoCita = new PagoCita({
          cita,
          culqiChargeId: culqiResponse.id || null,
          culqiToken: token,
          metodoPago: MetodoPagoCita.TARJETA,
          montoTotal,
          estado: EstadoPagoCita.FALLIDO,
          culqiResponse,
          mensajeError,
        });

        await this.pagoCitaRepository.create(pagoCita);

        return Result.failure(`El pago falló: ${mensajeError}`);
      }
    } catch (error) {
      console.error('💥 ERROR CATCH:', error);
      console.error('Stack:', error.stack);
      return Result.failure('Error al procesar el pago con tarjeta', error);
    }
  }
}
