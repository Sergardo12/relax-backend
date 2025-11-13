import { v4 as uuidv4 } from 'uuid';

export class DetalleGasto {
  private id: string;
  private descripcion: string;
  private cantidad: number;
  private precioUnitario: number;
  private subtotal: number;

  constructor({
    id = uuidv4(),
    descripcion,
    cantidad,
    precioUnitario,
  }: {
    id?: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (precioUnitario < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }

    this.id = id;
    this.descripcion = descripcion;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.subtotal = cantidad * precioUnitario;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getPrecioUnitario(): number {
    return this.precioUnitario;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  toJSON() {
    return {
      id: this.id,
      descripcion: this.descripcion,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      subtotal: this.subtotal,
    };
  }
}