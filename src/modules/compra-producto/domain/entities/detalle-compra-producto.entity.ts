import { v4 as uuidv4 } from 'uuid';
import { Producto } from '../../../producto/domain/entities/producto.entity';

export class DetalleCompraProducto {
  private id: string;
  private producto: Producto;
  private cantidad: number;
  private precioCompra: number; // Precio unitario al que se compró
  private subtotal: number;

  constructor({
    id = uuidv4(),
    producto,
    cantidad,
    precioCompra,
  }: {
    id?: string;
    producto: Producto;
    cantidad: number;
    precioCompra: number;
  }) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (precioCompra < 0) {
      throw new Error('El precio de compra no puede ser negativo');
    }

    this.id = id;
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioCompra = precioCompra;
    this.subtotal = cantidad * precioCompra;
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

  getPrecioCompra(): number {
    return this.precioCompra;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  toJSON() {
    return {
      id: this.id,
      producto: this.producto.toJSON(),
      cantidad: this.cantidad,
      precioCompra: this.precioCompra,
      subtotal: this.subtotal,
    };
  }
}