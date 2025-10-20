import { v4 as uuidv4 } from 'uuid';
import { Cita } from '../../../cita/domain/entities/cita.entity';
import { MetodoPagoCita } from '../enums/metodo-pago-cita.enum';
import { EstadoPagoCita } from '../enums/estado-pago-cita.enum';
import { CulqiChargeResponse } from '../../infrastructure/types/culqi-response.type';

export class PagoCita {
  private id: string;
  private cita: Cita;
  private culqiChargeId: string | null;
  private culqiToken: string | null;
  private fechaPago: Date;
  private metodoPago: MetodoPagoCita;
  private montoTotal: number;
  private moneda: string;
  private estado: EstadoPagoCita;
  private culqiResponse: CulqiChargeResponse | null;
  private mensajeError: string | null;
  private qrUrl: string | null;
  private paymentUrl: string | null;

  constructor({
    id = uuidv4(),
    cita,
    culqiChargeId = null,
    culqiToken = null,
    fechaPago = new Date(),
    metodoPago,
    montoTotal,
    moneda = 'PEN',
    estado = EstadoPagoCita.PENDIENTE,
    culqiResponse = null,
    mensajeError = null,
    qrUrl = null,
    paymentUrl = null,
  }: {
    id?: string;
    cita: Cita;
    culqiChargeId?: string | null;
    culqiToken?: string | null;
    fechaPago?: Date;
    metodoPago: MetodoPagoCita;
    montoTotal: number;
    moneda?: string;
    estado?: EstadoPagoCita;
    culqiResponse?: CulqiChargeResponse | null;
    mensajeError?: string | null;
    qrUrl?: string | null;
    paymentUrl?: string | null;
  }) {
    this.id = id;
    this.cita = cita;
    this.culqiChargeId = culqiChargeId;
    this.culqiToken = culqiToken;
    this.fechaPago = fechaPago;
    this.metodoPago = metodoPago;
    this.montoTotal = montoTotal;
    this.moneda = moneda;
    this.estado = estado;
    this.culqiResponse = culqiResponse;
    this.mensajeError = mensajeError;
    this.qrUrl = qrUrl;
    this.paymentUrl = paymentUrl;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getCita(): Cita {
    return this.cita;
  }

  getCulqiChargeId(): string | null {
    return this.culqiChargeId;
  }

  getCulqiToken(): string | null {
    return this.culqiToken;
  }

  getFechaPago(): Date {
    return this.fechaPago;
  }

  getMetodoPago(): MetodoPagoCita {
    return this.metodoPago;
  }

  getMontoTotal(): number {
    return this.montoTotal;
  }

  getMoneda(): string {
    return this.moneda;
  }

  getEstado(): EstadoPagoCita {
    return this.estado;
  }

  getCulqiResponse(): CulqiChargeResponse | null {
    return this.culqiResponse;
  }

  getMensajeError(): string | null {
    return this.mensajeError;
  }

  getQrUrl(): string | null {
    return this.qrUrl;
  }

  getPaymentUrl(): string | null {
    return this.paymentUrl;
  }

  // Método toJSON para serialización
  toJSON() {
    const citaBasica = {
      id: this.cita.getId(),
      fecha: this.cita.getFecha(),
      hora: this.cita.getHora(),
      estado: this.cita.getEstado(),
    };

    return {
      id: this.id,
      cita: citaBasica,
      culqiChargeId: this.culqiChargeId,
      culqiToken: this.culqiToken,
      fechaPago: this.fechaPago,
      metodoPago: this.metodoPago,
      montoTotal: this.montoTotal,
      moneda: this.moneda,
      estado: this.estado,
      culqiResponse: this.culqiResponse,
      mensajeError: this.mensajeError,
      qrUrl: this.qrUrl,
      paymentUrl: this.paymentUrl,
    };
  }
}
