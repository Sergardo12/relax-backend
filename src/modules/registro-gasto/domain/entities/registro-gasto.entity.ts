import { v4 as uuidv4 } from 'uuid';
import { ProveedorInsumo } from '../../../proveedor-insumo/domain/entities/proveedor-insumo.entity';
import { TipoComprobanteGasto, CategoriaGasto, EstadoGasto } from '../enums/registro-gasto.enum';

export class RegistroGasto {
  private id: string;
  private proveedor: ProveedorInsumo;
  private fecha: Date;
  private categoria: CategoriaGasto;
  private tipoComprobante: TipoComprobanteGasto;
  private numeroComprobante: string;
  private total: number;
  private estado: EstadoGasto;
  private observaciones?: string;
  private creadoEn: Date;
  private actualizadoEn: Date;

  constructor({
    id = uuidv4(),
    proveedor,
    fecha,
    categoria,
    tipoComprobante,
    numeroComprobante,
    total,
    estado = EstadoGasto.REGISTRADO,
    observaciones,
    creadoEn = new Date(),
    actualizadoEn = new Date(),
  }: {
    id?: string;
    proveedor: ProveedorInsumo;
    fecha: Date;
    categoria: CategoriaGasto;
    tipoComprobante: TipoComprobanteGasto;
    numeroComprobante: string;
    total: number;
    estado?: EstadoGasto;
    observaciones?: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = id;
    this.proveedor = proveedor;
    this.fecha = fecha;
    this.categoria = categoria;
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

  getProveedor(): ProveedorInsumo {
    return this.proveedor;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getCategoria(): CategoriaGasto {
    return this.categoria;
  }

  getTipoComprobante(): TipoComprobanteGasto {
    return this.tipoComprobante;
  }

  getNumeroComprobante(): string {
    return this.numeroComprobante;
  }

  getTotal(): number {
    return this.total;
  }

  getEstado(): EstadoGasto {
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
  anular(): void {
    this.estado = EstadoGasto.ANULADO;
    this.actualizadoEn = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      proveedor: this.proveedor.toJSON(),
      fecha: this.fecha,
      categoria: this.categoria,
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