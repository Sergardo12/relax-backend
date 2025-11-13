import { v4 as uuidv4 } from 'uuid';
import { Producto } from '../../../producto/domain/entities/producto.entity';

export class DetalleVentaProducto {
  private id: string;
  private producto: Producto;
  private cantidad: number;
  private precioUnitario: number; // Precio al que se vendió
  private subtotal: number;

  constructor({
    id = uuidv4(),
    producto,
    cantidad,
    precioUnitario,
  }: {
    id?: string;
    producto: Producto;
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
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.subtotal = cantidad * precioUnitario;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getProducto(): Producto {
    return this.producto;
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
      producto: this.producto.toJSON(),
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario,
      subtotal: this.subtotal,
    };
  }
}