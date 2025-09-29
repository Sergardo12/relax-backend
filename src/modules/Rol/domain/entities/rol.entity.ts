import {v4 as uuidv4} from 'uuid';
import { EstadoRol } from '../enums/rol.enum';

export class Rol {
  private readonly id: string;
  public  nombre: string;
  public descripcion: string;
  private estado: EstadoRol;

  constructor({
    id = uuidv4(), 
    nombre,
    descripcion,
    estado = EstadoRol.ACTIVO,
  }: {
    id?: string;
    nombre: string;
    descripcion: string;
    estado?: EstadoRol;
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
  }

    // Getters
  getId(): string {
    return this.id;
  }
  getEstado(): EstadoRol {
    return this.estado;
  }

  // Setters
  setNombre(nombre: string): void {
    if (!nombre.trim()) throw new Error("El nombre no puede estar vacío.");
    this.nombre = nombre;
  }

  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  setEstado(estado: EstadoRol): void {
    this.estado = estado;
  }
}

// const rol1 = new Rol({nombre: 'Admin', descripcion: 'Administrador del sistema'});

//rol1.setNombre('Super Admin');



