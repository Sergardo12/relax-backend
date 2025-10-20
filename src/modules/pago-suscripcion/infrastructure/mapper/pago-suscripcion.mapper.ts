import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionOrmEntity } from '../database/pago-suscripcion.orm-entity';
import { SuscripcionMapper } from '../../../suscripcion/infrastructure/mapper/suscripcion.mapper';
import { SuscripcionOrmEntity } from '../../../suscripcion/infrastructure/database/suscripcion.orm-entity';

export class PagoSuscripcionMapper {
  static toDomain(pagoSuscripcion: PagoSuscripcionOrmEntity): PagoSuscripcion {
    return new PagoSuscripcion({
      id: pagoSuscripcion.id,
      suscripcion: SuscripcionMapper.toDomain(pagoSuscripcion.suscripcion),
      culqiChargeId: pagoSuscripcion.culqiChargeId,
      culqiToken: pagoSuscripcion.culqiToken,
      fechaPago: pagoSuscripcion.fechaPago,
      metodoPago: pagoSuscripcion.metodoPago,
      montoTotal: Number(pagoSuscripcion.montoTotal),
      moneda: pagoSuscripcion.moneda,
      estado: pagoSuscripcion.estado,
      culqiResponse: pagoSuscripcion.culqiResponse,
      mensajeError: pagoSuscripcion.mensajeError,
      qrUrl: pagoSuscripcion.qrUrl, 
      paymentUrl: pagoSuscripcion.paymentUrl, 
    });
  }

  static toOrmEntity(pago: PagoSuscripcion): PagoSuscripcionOrmEntity {
    const pagoSuscripcionOrm = new PagoSuscripcionOrmEntity();
    pagoSuscripcionOrm.id = pago.getId();

    // Relación Suscripcion
    const suscripcionOrm = new SuscripcionOrmEntity();
    suscripcionOrm.id = pago.getSuscripcion().getId();
    pagoSuscripcionOrm.suscripcion = suscripcionOrm;

    pagoSuscripcionOrm.culqiChargeId = pago.getCulqiChargeId();
    pagoSuscripcionOrm.culqiToken = pago.getCulqiToken();
    pagoSuscripcionOrm.fechaPago = pago.getFechaPago();
    pagoSuscripcionOrm.metodoPago = pago.getMetodoPago();
    pagoSuscripcionOrm.montoTotal = pago.getMontoTotal();
    pagoSuscripcionOrm.moneda = pago.getMoneda();
    pagoSuscripcionOrm.estado = pago.getEstado();
    pagoSuscripcionOrm.culqiResponse = pago.getCulqiResponse();
    pagoSuscripcionOrm.mensajeError = pago.getMensajeError();
    pagoSuscripcionOrm.qrUrl = pago.getQrUrl(); // ⭐ NUEVO
    pagoSuscripcionOrm.paymentUrl = pago.getPaymentUrl(); // ⭐ NUEVO

    return pagoSuscripcionOrm;
  }
}