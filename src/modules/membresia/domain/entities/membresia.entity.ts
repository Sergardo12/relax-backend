import { v4 as uuidv4 } from 'uuid';
import { EstadoMembresia } from '../enum/membresia.enum';

export class Membresia {
  private id: string;
  private nombre: string;
  private descripcion: string;
  private precio: number;
  private duracionDias: number;
  private estado: EstadoMembresia;

  constructor({
    id = uuidv4(),
    nombre,
    descripcion,
    precio,
    duracionDias,
    estado = EstadoMembresia.ACTIVA,
  }: {
    id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionDias: number;
    estado?: EstadoMembresia;
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.duracionDias = duracionDias;
    this.estado = estado;
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

  getPrecio(): number {
    return this.precio;
  }

  getDuracionDias(): number {
    return this.duracionDias;
  }

  getEstado(): EstadoMembresia {
    return this.estado;
  }

  // Métodos de negocio
  desactivar(): void {
    this.estado = EstadoMembresia.INACTIVA;
  }

  activar(): void {
    this.estado = EstadoMembresia.ACTIVA;
  }

  // Serialización
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      duracionDias: this.duracionDias,
      estado: this.estado,
    };
  }
}