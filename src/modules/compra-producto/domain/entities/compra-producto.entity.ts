import { v4 as uuidv4 } from 'uuid';
import {EstadoCompraProducto, TipoComprobanteCompraProducto } from '../enums/compra-producto.enum';
import { ProveedorProducto } from 'src/modules/proveedor-producto/domain/entities/proveedor-producto.entity';

export class CompraProducto {
  private id: string;
  private proveedor: ProveedorProducto;
  private fecha: Date;
  private tipoComprobante: TipoComprobanteCompraProducto;
  private numeroComprobante: string;
  private total: number;
  private estado: EstadoCompraProducto;
  private observaciones?: string;
  private creadoEn: Date;
  private actualizadoEn: Date;

  constructor({
    id = uuidv4(),
    proveedor,
    fecha,
    tipoComprobante,
    numeroComprobante,
    total,
    estado = EstadoCompraProducto.REGISTRADA,
    observaciones,
    creadoEn = new Date(),
    actualizadoEn = new Date(),
  }: {
    id?: string;
    proveedor: ProveedorProducto;
    fecha: Date;
    tipoComprobante: TipoComprobanteCompraProducto;
    numeroComprobante: string;
    total: number;
    estado?: EstadoCompraProducto;
    observaciones?: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = id;
    this.proveedor = proveedor;
    this.fecha = fecha;
    this.tipoComprobante = tipoComprobante;
    this.numeroComprobante = numeroComprobante;
    this.total = total;
    this.estado = estado;
    this.observaciones = observaciones;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getProveedor(): ProveedorProducto {
    return this.proveedor;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getTipoComprobante(): TipoComprobanteCompraProducto {
    return this.tipoComprobante;
  }

  getNumeroComprobante(): string {
    return this.numeroComprobante;
  }

  getTotal(): number {
    return this.total;
  }

  getEstado(): EstadoCompraProducto {
    return this.estado;
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
  marcarComoRecibida(): void {
    this.estado = EstadoCompraProducto.RECIBIDA;
    this.actualizadoEn = new Date();
  }

  anular(): void {
    this.estado = EstadoCompraProducto.ANULADA;
    this.actualizadoEn = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      proveedor: this.proveedor.toJSON(),
      fecha: this.fecha,
      tipoComprobante: this.tipoComprobante,
      numeroComprobante: this.numeroComprobante,
      total: this.total,
      estado: this.estado,
      observaciones: this.observaciones ?? null,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn,
    };
  }
}