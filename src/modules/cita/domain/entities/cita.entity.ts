import { v4 as uuidv4 } from 'uuid';
import { Paciente } from '../../../paciente/domain/entities/paciente.entity';
import { CitaEstado, EstadoPago } from '../enums/cita.enum';

export class Cita {
  private id: string;
  private paciente: Paciente;
  private fecha: Date;
  private hora: string;
  private estado: CitaEstado;
  private estadoPago: EstadoPago;

  constructor({
    id = uuidv4(),
    paciente,
    fecha,
    hora,
    estado,
    estadoPago,
  }: {
    id?: string;
    paciente: Paciente;
    fecha: Date;
    hora: string;
    estado: CitaEstado;
    estadoPago: EstadoPago;
  }) {
    this.id = id;
    this.paciente = paciente;
    this.fecha = fecha;
    this.hora = hora;
    this.estado = estado;
    this.estadoPago = estadoPago;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getPaciente(): Paciente {
    return this.paciente;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getHora(): string {
    return this.hora;
  }

  getEstado(): CitaEstado {
    return this.estado;
  }

  getEstadoPago(): EstadoPago {
    return this.estadoPago;
  }

  // Métodos de negocio
  cancelar(): void {
    if (this.estado === CitaEstado.CANCELADA) {
      throw new Error('La cita ya está cancelada.');
    }
    if (this.estado === CitaEstado.COMPLETADA) {
      throw new Error('No se puede cancelar una cita completada.');
    }
    this.estado = CitaEstado.CANCELADA;
  }

  confirmar(): void {
    if (this.estado === CitaEstado.CANCELADA) {
      throw new Error('No se puede confirmar una cita cancelada.');
    }
    if (this.estado === CitaEstado.COMPLETADA) {
      throw new Error('No se puede confirmar una cita completada.');
    }
    this.estado = CitaEstado.CONFIRMADA;
  }

  marcarComoPagada(): void {
    if (this.estadoPago === EstadoPago.PAGADO) {
      throw new Error('La cita ya está marcada como pagada.');
    }
    this.estadoPago = EstadoPago.PAGADO;
  }

  completar(): void {
    if (this.estado === CitaEstado.CANCELADA) {
      throw new Error('No se puede completar una cita cancelada.');
    }
    this.estado = CitaEstado.COMPLETADA;
  }

  // Método toJSON para serialización
  toJSON() {
    return {
      id: this.id,
      paciente: this.paciente.toJSON(),
      fecha: this.fecha,
      hora: this.hora,
      estado: this.estado,
      estadoPago: this.estadoPago,
    };
  }
}