import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { PAGO_CITA_REPOSITORY_TOKEN } from '../../infrastructure/pago-cita.repository.token';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { EstadoPagoCita } from '../../domain/enums/estado-pago-cita.enum';
import { PagoCita } from '../../domain/entities/pago-cita.entity';

@Injectable()
export class ProcesarWebhookCulqiUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async execute(payload: any): Promise<Result<boolean>> {
    try {
      // Extraer el ID de la orden o cargo
      const orderId = payload.order?.id || payload.data?.id || payload.id;
      if (!orderId) {
        return Result.failure('No se pudo extraer el ID de la orden/cargo');
      }

      // Buscar el pago por culqiChargeId
      const pagoCitaResult =
        await this.pagoCitaRepository.findByCulqiChargeId(orderId);
      if (!pagoCitaResult.ok) {
        return Result.failure(
          `Error al buscar el pago: ${pagoCitaResult.message}`,
        );
      }

      const pagoCita = pagoCitaResult.value;
      if (!pagoCita) {
        return Result.failure(`No se encontró pago con orden ID ${orderId}`);
      }

      // Verificar el estado del pago
      const state = payload.data?.state || payload.state;

      if (state === 'paid') {
        // Actualizar estado del pago a EXITOSO
        const nuevoEstado = EstadoPagoCita.EXITOSO;
        const pagoCitaActualizado = new PagoCita({
          id: pagoCita.getId(),
          cita: pagoCita.getCita(),
          culqiChargeId: pagoCita.getCulqiChargeId(),
          culqiToken: pagoCita.getCulqiToken(),
          fechaPago: pagoCita.getFechaPago(),
          metodoPago: pagoCita.getMetodoPago(),
          montoTotal: pagoCita.getMontoTotal(),
          moneda: pagoCita.getMoneda(),
          estado: nuevoEstado,
          culqiResponse: pagoCita.getCulqiResponse(),
          mensajeError: pagoCita.getMensajeError(),
          qrUrl: pagoCita.getQrUrl(),
          paymentUrl: pagoCita.getPaymentUrl(),
        });

        const updateResult =
          await this.pagoCitaRepository.update(pagoCitaActualizado);
        if (!updateResult.ok) {
          return Result.failure(
            `Error al actualizar el pago: ${updateResult.message}`,
          );
        }

        // Actualizar estado de pago de la cita
        const cita = pagoCita.getCita();
        cita.marcarComoPagada();
        await this.citaRepository.update(cita.getId(), cita);

        return Result.success(true);
      } else {
        // Si el estado no es 'paid', marcar como fallido
        const nuevoEstado = EstadoPagoCita.FALLIDO;
        const mensajeError =
          payload.data?.outcome?.user_message || 'Pago rechazado';

        const pagoCitaActualizado = new PagoCita({
          id: pagoCita.getId(),
          cita: pagoCita.getCita(),
          culqiChargeId: pagoCita.getCulqiChargeId(),
          culqiToken: pagoCita.getCulqiToken(),
          fechaPago: pagoCita.getFechaPago(),
          metodoPago: pagoCita.getMetodoPago(),
          montoTotal: pagoCita.getMontoTotal(),
          moneda: pagoCita.getMoneda(),
          estado: nuevoEstado,
          culqiResponse: pagoCita.getCulqiResponse(),
          mensajeError: mensajeError,
          qrUrl: pagoCita.getQrUrl(),
          paymentUrl: pagoCita.getPaymentUrl(),
        });

        await this.pagoCitaRepository.update(pagoCitaActualizado);

        return Result.success(false);
      }
    } catch (error) {
      return Result.failure('Error al procesar el webhook de Culqi', error);
    }
  }
}
