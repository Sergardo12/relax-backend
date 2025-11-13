import { v4 as uuidv4 } from 'uuid';
import { EstadoProveedorInsumo } from '../enums/proveedor-insumo.enum';

export class ProveedorInsumo {
  private id: string;
  private nombre: string;
  private ruc: string;
  private telefono: string;
  private email?: string;
  private direccion?: string;
  private estado: EstadoProveedorInsumo;
  private creadoEn: Date;
  private actualizadoEn: Date;

  constructor({
    id = uuidv4(),
    nombre,
    ruc,
    telefono,
    email,
    direccion,
    estado = EstadoProveedorInsumo.ACTIVO,
    creadoEn = new Date(),
    actualizadoEn = new Date(),
  }: {
    id?: string;
    nombre: string;
    ruc: string;
    telefono: string;
    email?: string;
    direccion?: string;
    estado?: EstadoProveedorInsumo;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }) {
    this.id = id;
    this.nombre = nombre;
    this.ruc = ruc;
    this.telefono = telefono;
    this.email = email;
    this.direccion = direccion;
    this.estado = estado;
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

  getRuc(): string {
    return this.ruc;
  }

  getTelefono(): string {
    return this.telefono;
  }

  getEmail(): string | undefined {
    return this.email;
  }

  getDireccion(): string | undefined {
    return this.direccion;
  }

  getEstado(): EstadoProveedorInsumo {
    return this.estado;
  }

  getCreadoEn(): Date {
    return this.creadoEn;
  }

  getActualizadoEn(): Date {
    return this.actualizadoEn;
  }

  // Métodos de negocio
  activar(): void {
    this.estado = EstadoProveedorInsumo.ACTIVO;
    this.actualizadoEn = new Date();
  }

  desactivar(): void {
    this.estado = EstadoProveedorInsumo.INACTIVO;
    this.actualizadoEn = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      ruc: this.ruc,
      telefono: this.telefono,
      email: this.email ?? null,
      direccion: this.direccion ?? null,
      estado: this.estado,
      creadoEn: this.creadoEn,
      actualizadoEn: this.actualizadoEn,
    };
  }
}