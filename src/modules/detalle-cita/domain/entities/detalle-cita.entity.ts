import { Cita } from 'src/modules/cita/domain/entities/cita.entity';
import { Servicio } from 'src/modules/servicio/domain/entities/servicio.entity';
import { Colaborador } from 'src/modules/colaborador/domain/entities/colaborador.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConsumoBeneficio } from 'src/modules/consumo-beneficio/domain/entities/consumo-beneficio.entity';

export class DetalleCita {
  private id: string;
  private cita: Cita;
  private servicio: Servicio;
  private colaborador: Colaborador;
  private consumoBeneficio?: ConsumoBeneficio
  private precioUnitario: number;
  private cantidad: number;
  private subtotal: number;
  private esConMembresia: boolean;
  private observaciones?: string;
  private diagnostico?: string;
  private recomendaciones?: string;
  private fechaRegistro?: Date;

  constructor({
    id = uuidv4(),
    cita,
    servicio,
    colaborador,
    consumoBeneficio,
    precioUnitario,
    cantidad = 1,
    subtotal,
    esConMembresia = false,
    observaciones,
    diagnostico,
    recomendaciones,
    fechaRegistro,
  }: {
    id?: string;
    cita: Cita;
    servicio: Servicio;
    colaborador: Colaborador;
    consumoBeneficio?: ConsumoBeneficio; 
    precioUnitario: number;
    cantidad?: number;
    subtotal: number;
    esConMembresia?: boolean;
    observaciones?: string;
    diagnostico?: string;
    recomendaciones?: string;
    fechaRegistro?: Date;
  }) {
    this.id = id;
    this.cita = cita;
    this.servicio = servicio;
    this.colaborador = colaborador;
    this.consumoBeneficio = consumoBeneficio;
    this.precioUnitario = precioUnitario;
    this.cantidad = cantidad;
    this.subtotal = subtotal;
    this.esConMembresia = esConMembresia;
    this.observaciones = observaciones;
    this.diagnostico = diagnostico;
    this.recomendaciones = recomendaciones;
    this.fechaRegistro = fechaRegistro;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getCita(): Cita {
    return this.cita;
  }

  getServicio(): Servicio {
    return this.servicio;
  }

  getColaborador(): Colaborador {
    return this.colaborador;
  }

  getConsumoBeneficio(): ConsumoBeneficio | undefined {
    return this.consumoBeneficio;
  }

  getPrecioUnitario(): number {
    return this.precioUnitario;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getEsConMembresia(): boolean {
    return this.esConMembresia;
  }

  getObservaciones(): string | undefined {
    return this.observaciones;
  }

  getDiagnostico(): string | undefined {
    return this.diagnostico;
  }

  getRecomendaciones(): string | undefined {
    return this.recomendaciones;
  }

  getFechaRegistro(): Date | undefined {
    return this.fechaRegistro;
  }

  // Métodos de negocio
  actualizarObservaciones(
    observaciones?: string,
    diagnostico?: string,
    recomendaciones?: string,
  ): void {
    if (observaciones !== undefined) {
      this.observaciones = observaciones;
    }
    if (diagnostico !== undefined) {
      this.diagnostico = diagnostico;
    }
    if (recomendaciones !== undefined) {
      this.recomendaciones = recomendaciones;
    }
  }

  fuePagadoConMembresia(): boolean {
    return this.esConMembresia && this.consumoBeneficio !== undefined;
  }

  // Método toJSON para serialización
  toJSON() {
    return {
      id: this.id,
      cita: {
        id: this.cita.getId(),
        fecha: this.cita.getFecha(),
        hora: this.cita.getHora(),
        estado: this.cita.getEstado(),
      },
      servicio: this.servicio,
      colaborador: this.colaborador,
      consumoBeneficio: this.consumoBeneficio ? {
        id: this.consumoBeneficio.getId(),
        cantidadDisponible: this.consumoBeneficio.getCantidadDisponible(),
      } : null,
      precioUnitario: this.precioUnitario,
      cantidad: this.cantidad,
      subtotal: this.subtotal,
      esConMembresia: this.esConMembresia,
      observaciones: this.observaciones,
      diagnostico: this.diagnostico,
      recomendaciones: this.recomendaciones,
      fechaRegistro: this.fechaRegistro,
    };
  }
}