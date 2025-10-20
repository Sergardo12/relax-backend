import { v4 as uuidv4 } from 'uuid';
import { Suscripcion } from '../../../suscripcion/domain/entities/suscripcion.entity';
import { MetodoPagoSuscripcion, EstadoPagoSuscripcion } from '../enum/pago-suscripcion.enum';

export class PagoSuscripcion {
  private id: string;
  private suscripcion: Suscripcion;
  private culqiChargeId?: string;
  private culqiToken?: string;
  private fechaPago: Date;
  private metodoPago: MetodoPagoSuscripcion;
  private montoTotal: number;
  private moneda: string;
  private estado: EstadoPagoSuscripcion;
  private culqiResponse?: any;
  private mensajeError?: string;
  private qrUrl?: string; 
  private paymentUrl?: string; 

  constructor({
    id = uuidv4(),
    suscripcion,
    culqiChargeId,
    culqiToken,
    fechaPago = new Date(),
    metodoPago,
    montoTotal,
    moneda = 'PEN',
    estado = EstadoPagoSuscripcion.PENDIENTE,
    culqiResponse,
    mensajeError,
    qrUrl, 
    paymentUrl
  }: {
    id?: string;
    suscripcion: Suscripcion;
    culqiChargeId?: string;
    culqiToken?: string;
    fechaPago?: Date;
    metodoPago: MetodoPagoSuscripcion;
    montoTotal: number;
    moneda?: string;
    estado?: EstadoPagoSuscripcion;
    culqiResponse?: any;
    mensajeError?: string;
    qrUrl?: string; 
    paymentUrl?: string; 
  }) {
    this.id = id;
    this.suscripcion = suscripcion;
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

  getSuscripcion(): Suscripcion {
    return this.suscripcion;
  }

  getCulqiChargeId(): string | undefined {
    return this.culqiChargeId;
  }

  getCulqiToken(): string | undefined {
    return this.culqiToken;
  }

  getFechaPago(): Date {
    return this.fechaPago;
  }

  getMetodoPago(): MetodoPagoSuscripcion {
    return this.metodoPago;
  }

  getMontoTotal(): number {
    return this.montoTotal;
  }

  getMoneda(): string {
    return this.moneda;
  }

  getEstado(): EstadoPagoSuscripcion {
    return this.estado;
  }

  getCulqiResponse(): any {
    return this.culqiResponse;
  }

  getMensajeError(): string | undefined {
    return this.mensajeError;
  }

   getQrUrl(): string | undefined {
    return this.qrUrl;
  }

  getPaymentUrl(): string | undefined {
    return this.paymentUrl;
  }

  // Serialización
  toJSON() {
    return {
      id: this.id,
      suscripcion: {
        id: this.suscripcion.getId(),
      },
      culqiChargeId: this.culqiChargeId ?? null,
      culqiToken: this.culqiToken ?? null,
      fechaPago: this.fechaPago,
      metodoPago: this.metodoPago,
      montoTotal: this.montoTotal,
      moneda: this.moneda,
      estado: this.estado,
      culqiResponse: this.culqiResponse ?? null,
      mensajeError: this.mensajeError ?? null,
      qrUrl: this.qrUrl ?? null, 
      paymentUrl: this.paymentUrl ?? null
    };
  }
}