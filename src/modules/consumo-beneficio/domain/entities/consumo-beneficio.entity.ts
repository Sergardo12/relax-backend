import { v4 as uuidv4 } from 'uuid';
import { Suscripcion } from '../../../suscripcion/domain/entities/suscripcion.entity';
import { Servicio } from '../../../servicio/domain/entities/servicio.entity';

export class ConsumoBeneficio {
  private id: string;
  private suscripcion: Suscripcion;
  private servicio: Servicio;
  private cantidadTotal: number;
  private cantidadConsumida: number;
  private cantidadDisponible: number;

  constructor({
    id = uuidv4(),
    suscripcion,
    servicio,
    cantidadTotal,
    cantidadConsumida = 0,
    cantidadDisponible,
  }: {
    id?: string;
    suscripcion: Suscripcion;
    servicio: Servicio;
    cantidadTotal: number;
    cantidadConsumida?: number;
    cantidadDisponible: number;
  }) {
    this.id = id;
    this.suscripcion = suscripcion;
    this.servicio = servicio;
    this.cantidadTotal = cantidadTotal;
    this.cantidadConsumida = cantidadConsumida;
    this.cantidadDisponible = cantidadDisponible;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getSuscripcion(): Suscripcion {
    return this.suscripcion;
  }

  getServicio(): Servicio {
    return this.servicio;
  }

  getCantidadTotal(): number {
    return this.cantidadTotal;
  }

  getCantidadConsumida(): number {
    return this.cantidadConsumida;
  }

  getCantidadDisponible(): number {
    return this.cantidadDisponible;
  }


  // Métodos de negocio
  consumir(cantidad: number = 1): boolean {
    if (this.cantidadDisponible < cantidad) {
      return false; // No hay suficientes disponibles
    }

    this.cantidadConsumida += cantidad;
    this.cantidadDisponible -= cantidad;
    return true;
  }

  tieneDisponible(cantidad: number = 1): boolean {
    return this.cantidadDisponible >= cantidad;
  }

  // Serialización
  toJSON() {
    return {
      id: this.id,
      suscripcion: {
        id: this.suscripcion.getId(),
      },
      servicio: {
        id: this.servicio.id,
        nombre: this.servicio.nombre,
      },
      cantidadTotal: this.cantidadTotal,
      cantidadConsumida: this.cantidadConsumida,
      cantidadDisponible: this.cantidadDisponible,
    };
  }
}