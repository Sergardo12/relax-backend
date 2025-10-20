import { v4 as uuidv4 } from 'uuid';
import { Membresia } from '../../../membresia/domain/entities/membresia.entity';
import { Servicio } from '../../../servicio/domain/entities/servicio.entity';

export class BeneficioMembresia {
  private id: string;
  private membresia: Membresia;
  private servicio: Servicio;
  private cantidad: number;

  constructor({
    id = uuidv4(),
    membresia,
    servicio,
    cantidad,
  }: {
    id?: string;
    membresia: Membresia;
    servicio: Servicio;
    cantidad: number;
  }) {
    this.id = id;
    this.membresia = membresia;
    this.servicio = servicio;
    this.cantidad = cantidad;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getMembresia(): Membresia {
    return this.membresia;
  }

  getServicio(): Servicio {
    return this.servicio;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  // Serialización
  toJSON() {
    return {
      id: this.id,
      membresia: {
        id: this.membresia.getId(),
        nombre: this.membresia.getNombre(),
      },
      servicio: {
        id: this.servicio.id,
        nombre: this.servicio.nombre,
        precio: this.servicio.precio,
      },
      cantidad: this.cantidad,
    };
  }
}