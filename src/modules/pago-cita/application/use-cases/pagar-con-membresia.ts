import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PAGO_CITA_REPOSITORY_TOKEN } from '../../infrastructure/pago-cita.repository.token';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../../detalle-cita/infrastructure/detalle-cita.repository.token';
import { DetalleCitaRepository } from '../../../detalle-cita/domain/repositories/detalle-cita.repository';
import { ConsumoBeneficioService } from '../../../consumo-beneficio/application/services/consumo-beneficio.service';
import { PagarConMembresiaDto } from '../../infrastructure/dto/pagar-con-membresia';
import { MetodoPagoCita } from '../../domain/enums/metodo-pago-cita.enum';
import { EstadoPagoCita } from '../../domain/enums/estado-pago-cita.enum';

@Injectable()
export class PagarConMembresiaUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
    private readonly consumoBeneficioService: ConsumoBeneficioService,
  ) {}

  async execute(dto: PagarConMembresiaDto): Promise<Result<PagoCita>> {
    try {
      const { idCita, email } = dto;

      console.log('🎫 1. Iniciando pago con membresía para cita:', idCita);

      // 1. Buscar la cita
      const citaResult = await this.citaRepository.findById(idCita);
      if (!citaResult.ok) {
        return Result.failure('Cita no encontrada');
      }

      const cita = citaResult.value;

      // ⭐ VALIDACIÓN ADICIONAL
      if (!cita) {
        return Result.failure('Cita no encontrada');
      }

      // 2. Obtener detalles con membresía
      const detallesResult = await this.detalleCitaRepository.findByCitaId(idCita);
      if (!detallesResult.ok) {
        return Result.failure('Error al obtener detalles de la cita');
      }

      const detallesConMembresia = detallesResult.value.filter(
        (detalle) => detalle.getEsConMembresia(),
      );

      console.log(`🎫 2. Detalles con membresía encontrados: ${detallesConMembresia.length}`);

      if (detallesConMembresia.length === 0) {
        return Result.failure('No hay servicios pagados con membresía en esta cita');
      }

      // 3. Consumir cada beneficio usando el servicio existente
     for (const detalle of detallesConMembresia) {
      // ⭐ CAMBIAR ESTO
      const consumoBeneficio = detalle.getConsumoBeneficio();

      if (!consumoBeneficio) {
        return Result.failure(
          `El detalle ${detalle.getId()} no tiene consumo de beneficio asociado`,
        );
      }

      const idConsumoBeneficio = consumoBeneficio.getId(); // ⭐ Ahora sí obtenemos el ID correcto
      const cantidad = detalle.getCantidad();

      console.log(`✅ 3. Consumiendo ${cantidad} de beneficio ${idConsumoBeneficio}`);

      const consumoResult = await this.consumoBeneficioService.consumirBeneficio(
        idConsumoBeneficio,
        cantidad,
      );

      if (!consumoResult.ok) {
        return Result.failure(consumoResult.message);
      }
}
      // 4. Crear registro de pago
      const nuevoPago = new PagoCita({
        cita: cita, // ✅ Ahora TypeScript sabe que NO es null
        metodoPago: MetodoPagoCita.MEMBRESIA,
        estado: EstadoPagoCita.EXITOSO,
        montoTotal: 0,
      });

      console.log('✅ 4. Creando registro de pago con membresía');

      const pagoResult = await this.pagoCitaRepository.create(nuevoPago);

      if (!pagoResult.ok) {
        return Result.failure('Error al crear el registro de pago');
      }

      // 5. Verificar si la cita está completamente pagada
      const detallesSinMembresia = detallesResult.value.filter(
        (detalle) => !detalle.getEsConMembresia(),
      );

      let citaCompletamentePagada = detallesConMembresia.length > 0;

      if (detallesSinMembresia.length > 0) {
        const pagoExistenteResult = await this.pagoCitaRepository.findByCitaId(idCita);
        if (pagoExistenteResult.ok) {
          const pagos = pagoExistenteResult.value;
          const hayPagoNormal = pagos.some(
            (pago) =>
              pago.getEstado() === EstadoPagoCita.EXITOSO &&
              pago.getMetodoPago() !== MetodoPagoCita.MEMBRESIA,
          );
          citaCompletamentePagada = hayPagoNormal;
        } else {
          citaCompletamentePagada = false;
        }
      }

      // 6. Confirmar cita si está completamente pagada
      if (citaCompletamentePagada) {
        cita.marcarComoPagada();
        await this.citaRepository.update(idCita, cita);
        console.log('✅ 5. Cita confirmada');
      } else {
        console.log('⏳ 5. Cita parcialmente pagada');
      }

      return pagoResult;
    } catch (error) {
      console.error('💥 ERROR en PagarConMembresiaUseCase:', error);
      return Result.failure(`Error al procesar pago con membresía: ${error.message}`);
    }
  }
}