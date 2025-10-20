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
import { PagarConEfectivoDto } from '../../infrastructure/dto/pagar-con-efectivo.dto';
import { EstadoPago } from 'src/modules/cita/domain/enums/cita.enum';

@Injectable()
export class PagarConEfectivoUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    private readonly pagoCitaService: PagoCitaService,
  ) {}

  async execute(dto: PagarConEfectivoDto): Promise<Result<PagoCita>> {
    try {
       console.log('🔍 1. DTO recibido:', dto);
      const { idCita, email } = dto;

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
        console.log('❌ Cita es null');
        return Result.failure('La cita no existe');
      }

      // Validar que la cita NO está pagada
      console.log('🔍 5. Estado pago actual:', cita.getEstadoPago());
      if (cita.getEstadoPago() === EstadoPago.PAGADO) {
        return Result.failure('La cita ya está pagada');
      }

      // Calcular monto total
      console.log('🔍 6. Calculando monto...');
      const montoTotal = await this.pagoCitaService.calcularMontoTotal(idCita);
      console.log('✅ 7. Monto total:', montoTotal);

      // Crear PagoCita con estado EXITOSO (pago en efectivo)
      console.log('🔍 8. Creando PagoCita...');
      const pagoCita = new PagoCita({
        cita,
        metodoPago: MetodoPagoCita.EFECTIVO,
        montoTotal,
        estado: EstadoPagoCita.EXITOSO,
      });
       console.log('✅ 9. PagoCita creada en memoria');

       console.log('🔍 10. Guardando en BD...');
      const createResult = await this.pagoCitaRepository.create(pagoCita);
       console.log('🔍 11. Create result:', createResult.ok);
      if (!createResult.ok) {
        return Result.failure(
          `Error al registrar el pago: ${createResult.message}`,
        );
      }

      // Actualizar estado de pago de la cita
      cita.marcarComoPagada();
      await this.citaRepository.update(idCita, cita);

      return Result.success(createResult.value);
    } catch (error) {
       console.error('💥 ERROR CATCH:', error);
      return Result.failure('Error al procesar el pago con efectivo', error);
    }
  }
}
