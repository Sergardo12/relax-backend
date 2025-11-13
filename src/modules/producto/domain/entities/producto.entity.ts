import { EstadoProducto } from '../enums/producto.enum';
import { v4 as uuidv4 } from 'uuid';

export class Producto {
  private id: string;
  private nombre: string;
  private descripcion: string;
  private precioCosto: number;
  private precioVenta: number;
  private stock: number;
  private stockMinimo: number;
  private categoria: string;
  private estado: EstadoProducto;
  private fechaVencimiento?: Date;
  private lote?: string;
  private creadoEn: Date;
  private actualizadoEn: Date;

  constructor({
    id = uuidv4(),
    nombre,
    descripcion,
    precioCosto,
    precioVenta,
    stock,
    stockMinimo,
    categoria,
    estado = EstadoProducto.ACTIVO,
    fechaVencimiento,
    lote,
    creadoEn = new Date(), // ⭐ Valor por defecto
    actualizadoEn = new Date(), // ⭐ Valor por defecto
  }: {
    id?: string;
    nombre: string;
    descripcion: string;
    precioCosto: number;
    precioVenta: number;
    stock: number;
    stockMinimo: number;
    categoria: string;
    estado?: EstadoProducto;
    fechaVencimiento?: Date;
    lote?: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precioCosto = precioCosto;
    this.precioVenta = precioVenta;
    this.stock = stock;
    this.stockMinimo = stockMinimo;
    this.categoria = categoria;
    this.estado = estado;
    this.fechaVencimiento = fechaVencimiento;
    this.lote = lote;
    this.creadoEn = creadoEn;
    this.actualizadoEn = actualizadoEn;
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getNombre(): string {
    return this.nombre;
  }
  getDescripcion(): string {
    return this.descripcion;
  }
  getPrecioCosto(): number {
    return this.precioCosto;
  }
  getPrecioVenta(): number {
    return this.precioVenta;
  }
  getStock(): number {
    return this.stock;
  }
  getStockMinimo(): number {
    return this.stockMinimo;
  }
  getCategoria(): string {
    return this.categoria;
  }
  getEstado(): EstadoProducto {
    return this.estado;
  }
  getFechaVencimiento(): Date | undefined {
    return this.fechaVencimiento;
  }
  getLote(): string | undefined {
    return this.lote;
  }
  getCreadoEn(): Date {
    return this.creadoEn;
  }
  getActualizadoEn(): Date {
    return this.actualizadoEn;
  }

  // Métodos de negocio
  aumentarStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    this.stock += cantidad;
    this.actualizadoEn = new Date();
  }

  disminuirStock(cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (this.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= cantidad;
    this.actualizadoEn = new Date();
  }

  tieneStockBajo(): boolean {
    return this.stock <= this.stockMinimo;
  }

  estaVencido(): boolean {
    if (!this.fechaVencimiento) return false;
    return this.fechaVencimiento < new Date();
  }

  activar(): void {
    this.estado = EstadoProducto.ACTIVO; // ⭐ Corregido
    this.actualizadoEn = new Date();
  }

  desactivar(): void {
    this.estado = EstadoProducto.INACTIVO; // ⭐ Corregido
    this.actualizadoEn = new Date();
  }

  actualizarPrecios(precioCosto: number, precioVenta: number): void {
    if (precioCosto < 0 || precioVenta < 0) {
      throw new Error('Los precios deben ser mayores o iguales a 0');
    }
    if (precioVenta < precioCosto) {
      console.warn('⚠️ El precio de venta es menor al costo');
    }
    this.precioCosto = precioCosto;
    this.precioVenta = precioVenta;
    this.actualizadoEn = new Date();
  }

  calcularGanancia(): number {
    return this.precioVenta - this.precioCosto;
  }

  calcularMargen(): number {
    if (this.precioCosto === 0) return 0;
    return ((this.precioVenta - this.precioCosto) / this.precioCosto) * 100;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precioCosto: this.precioCosto,
      precioVenta: this.precioVenta,
      stock: this.stock,
      stockMinimo: this.stockMinimo,
      categoria: this.categoria,
      estado: this.estado,
      fechaVencimiento: this.fechaVencimiento ?? null,
      lote: this.lote ?? null,
      creadoEn: this.creadoEn, // ⭐ Agregado
      actualizadoEn: this.actualizadoEn, // ⭐ Agregado
    };
  }
}