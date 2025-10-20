import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaOrmEntity } from '../database/pago-cita-entity.orm';
import { CitaMapper } from '../../../cita/infrastructure/mapper/cita.mapper';
import { CitaOrmEntity } from '../../../cita/infrastructure/database/cita-entity.orm';

export class PagoCitaMapper {
  static toDomain(pagoCitaOrm: PagoCitaOrmEntity): PagoCita {
    return new PagoCita({
      id: pagoCitaOrm.id,
      cita: CitaMapper.toDomain(pagoCitaOrm.cita),
      culqiChargeId: pagoCitaOrm.culqiChargeId,
      culqiToken: pagoCitaOrm.culqiToken,
      fechaPago: pagoCitaOrm.fechaPago,
      metodoPago: pagoCitaOrm.metodoPago,
      montoTotal: Number(pagoCitaOrm.montoTotal),
      moneda: pagoCitaOrm.moneda,
      estado: pagoCitaOrm.estado,
      culqiResponse: pagoCitaOrm.culqiResponse,
      mensajeError: pagoCitaOrm.mensajeError,
      qrUrl: pagoCitaOrm.qrUrl,
      paymentUrl: pagoCitaOrm.paymentUrl,
    });
  }

  static toOrmEntity(pagoCita: PagoCita): PagoCitaOrmEntity {
    const pagoCitaOrm = new PagoCitaOrmEntity();
    pagoCitaOrm.id = pagoCita.getId();

    // Relación con Cita - solo asignamos el ID
    const citaOrm = new CitaOrmEntity();
    citaOrm.id = pagoCita.getCita().getId();
    pagoCitaOrm.cita = citaOrm;

    pagoCitaOrm.culqiChargeId = pagoCita.getCulqiChargeId();
    pagoCitaOrm.culqiToken = pagoCita.getCulqiToken();
    pagoCitaOrm.fechaPago = pagoCita.getFechaPago();
    pagoCitaOrm.metodoPago = pagoCita.getMetodoPago();
    pagoCitaOrm.montoTotal = pagoCita.getMontoTotal();
    pagoCitaOrm.moneda = pagoCita.getMoneda();
    pagoCitaOrm.estado = pagoCita.getEstado();
    pagoCitaOrm.culqiResponse = pagoCita.getCulqiResponse();
    pagoCitaOrm.mensajeError = pagoCita.getMensajeError();
    pagoCitaOrm.qrUrl = pagoCita.getQrUrl();
    pagoCitaOrm.paymentUrl = pagoCita.getPaymentUrl();

    return pagoCitaOrm;
  }
}
