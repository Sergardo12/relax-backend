import { v4 as uuidv4 } from 'uuid';
import { TipoComprobanteVenta, MetodoPagoVenta, EstadoVenta } from '../enums/venta-producto.enum';

export class VentaProducto {
  private id: string;
  private fecha: Date;
  private tipoComprobante: TipoComprobanteVenta;
  private numeroComprobante: string;
  private metodoPago: MetodoPagoVenta;
  private total: number;
  private descuento: number;
  private igv: number;
  private subtotal: number;
  private estado: EstadoVenta;
  private clienteNombre?: string; // Cliente final (opcional)
  private clienteDocumento?: string;
  private observaciones?: string;
  private creadoEn: Date;
  private actualizadoEn: Date;

  constructor({
    id = uuidv4(),
    fecha,
    tipoComprobante,
    numeroComprobante,
    metodoPago,
    total,
    descuento = 0,
    igv = 0,
    subtotal,
    estado = EstadoVenta.COMPLETADA,
    clienteNombre,
    clienteDocumento,
    observaciones,
    creadoEn = new Date(),
    actualizadoEn = new Date(),
  }: {
    id?: string;
    fecha: Date;
    tipoComprobante: TipoComprobanteVenta;
    numeroComprobante: string;
    metodoPago: MetodoPagoVenta;
    total: number;
    descuento?: number;
    igv?: number;
    subtotal: number;
    estado?: EstadoVenta;
    clienteNombre?: string;
    clienteDocumento?: string;
    observaciones?: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = id;
    this.fecha = fecha;
    this.tipoComprobante = tipoComprobante;
    this.numeroComprobante = numeroComprobante;
    this.metodoPago = metodoPago;
    this.total = total;
    this.descuento = descuento;
    this.igv = igv;
    this.subtotal = subtotal;
    this.estado = estado;
    this.clienteNombre = clienteNombre;
    this.clienteDocumento = clienteDocumento;
    this.observaciones = observaciones;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getTipoComprobante(): TipoComprobanteVenta {
    return this.tipoComprobante;
  }

  getNumeroComprobante(): string {
    return this.numeroComprobante;
  }

  getMetodoPago(): MetodoPagoVenta {
    return this.metodoPago;
  }

  getTotal(): number {
    return this.total;
  }

  getDescuento(): number {
    return this.descuento;
  }

  getIgv(): number {
    return this.igv;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getEstado(): EstadoVenta {
    return this.estado;
  }

  getClienteNombre(): string | undefined {
    return this.clienteNombre;
  }

  getClienteDocumento(): string | undefined {
    return this.clienteDocumento;
  }

  getObservaciones(): string | undefined {
    return this.observaciones;
  }

  getCreadoEn(): Date {
    return this.creadoEn;
  }

  getActualizadoEn(): Date {
    return this.actualizadoEn;
  }

  // Métodos de negocio
  anular(): void {
    this.estado = EstadoVenta.ANULADA;
    this.actualizadoEn = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      tipoComprobante: this.tipoComprobante,
      numeroComprobante: this.numeroComprobante,
      metodoPago: this.metodoPago,
      subtotal: this.subtotal,
      descuento: this.descuento,
      igv: this.igv,
      total: this.total,
      estado: this.estado,
      clienteNombre: this.clienteNombre ?? null,
      clienteDocumento: this.clienteDocumento ?? null,
      observaciones: this.observaciones ?? null,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn,
    };
  }
}