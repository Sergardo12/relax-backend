import { Usuario } from "src/modules/usuario/domain/entities/usuario.entity";
import { v4 as uuidv4 } from "uuid";

export class Paciente {
  private id: string;
  private usuario: Usuario;
  private nombres: string;
  private apellidos: string;
  private dni: string;
  private fechaNacimiento: Date;
  private telefono: string;

  constructor({
    id = uuidv4(),
    usuario,
    nombres,
    apellidos,
    dni,
    fechaNacimiento,
    telefono,
  }: {
    id?: string;
    usuario: Usuario;
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: Date;
    telefono: string;
  }) {
    this.id = id;
    this.usuario = usuario;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.dni = dni;
    this.fechaNacimiento = fechaNacimiento;
    this.telefono = telefono;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  getNombres(): string {
    return this.nombres;
  }

  getApellidos(): string {
    return this.apellidos;
  }

  getDni(): string {
    return this.dni;
  }

  getFechaNacimiento(): Date  {
    return this.fechaNacimiento;
  }

  getTelefono(): string  {
    return this.telefono;
  }

  // Setters con validación
  setNombres(nombres: string): void {
    if (!nombres.trim()) throw new Error("El nombre no puede estar vacío.");
    this.nombres = nombres;
  }

  setApellidos(apellidos: string): void {
    if (!apellidos.trim()) throw new Error("El apellido no puede estar vacío.");
    this.apellidos = apellidos;
  }

  setDni(dni: string): void {
    if (dni.length !== 8) throw new Error("El DNI debe tener 8 dígitos.");
    this.dni = dni;
  }

  setTelefono(telefono: string): void {
    if (!/^\d{9}$/.test(telefono)) {
      throw new Error("El teléfono debe tener 9 dígitos.");
    }
    this.telefono = telefono;
  }

  // Método toJSON para serialización
  toJSON() {
    return {
      id: this.id,
      usuario: this.usuario.toJSON(),
      nombres: this.nombres,
      apellidos: this.apellidos,
      dni: this.dni,
      fechaNacimiento: this.fechaNacimiento,
      telefono: this.telefono,
    };
  }
}