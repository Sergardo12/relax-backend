import { v4 as uuidv4 } from 'uuid';
import { Paciente } from '../../../paciente/domain/entities/paciente.entity';
import { Membresia } from '../../../membresia/domain/entities/membresia.entity';
import { EstadoSuscripcion } from '../enum/suscripcion.enum';

export class Suscripcion {
  private id: string;
  private paciente: Paciente;
  private membresia: Membresia;
  private fechaInicio?: Date;
  private fechaFin?: Date;
  private estado: EstadoSuscripcion;

  constructor({
    id = uuidv4(),
    paciente,
    membresia,
    fechaInicio,
    fechaFin,
    estado = EstadoSuscripcion.PENDIENTE_PAGO,
  }: {
    id?: string;
    paciente: Paciente;
    membresia: Membresia;
    fechaInicio?: Date;
    fechaFin?: Date;
    estado?: EstadoSuscripcion;
  }) {
    this.id = id;
    this.paciente = paciente;
    this.membresia = membresia;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.estado = estado;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getPaciente(): Paciente {
    return this.paciente;
  }

  getMembresia(): Membresia {
    return this.membresia;
  }

  getFechaInicio(): Date | undefined{
    return this.fechaInicio;
  }

  getFechaFin(): Date | undefined {
    return this.fechaFin;
  }

  getEstado(): EstadoSuscripcion {
    return this.estado;
  }

  // Métodos de negocio
  activar(): void {
    this.estado = EstadoSuscripcion.ACTIVA;
    this.fechaInicio = new Date();
    
    // Calcular fecha fin
    const fechaFin = new Date(this.fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + this.membresia.getDuracionDias());
    this.fechaFin = fechaFin;
  }

  vencer(): void {
    this.estado = EstadoSuscripcion.VENCIDA;
  }

  cancelar(): void {
    this.estado = EstadoSuscripcion.CANCELADA;
  }

  estaActiva(): boolean {
    if (this.estado !== EstadoSuscripcion.ACTIVA) {
      return false;
    }

    // Verificar si está vigente
    const hoy = new Date();
    if (this.fechaFin && hoy > this.fechaFin) {
      return false;
    }

    return true;
  }

  // Serialización
  toJSON() {
    
// si es que hay suscripcion retorname esto
    return {
      id: this.id,
      paciente: {
        id: this.paciente.getId(),
        nombre: this.paciente.getNombres(),
        apellido: this.paciente.getApellidos(),
      },
      membresia: {
        id: this.membresia.getId(),
        nombre: this.membresia.getNombre(),
        precio: this.membresia.getPrecio(),
      },
      // si es que hay fecha retorname fecha, sno hay nada en la bd retorname null
      fechaInicio: this.fechaInicio ?? null,
      fechaFin: this.fechaFin ?? null,
      estado: this.estado,
    };
  }
}

// si es que hay suscripcion retorname esto