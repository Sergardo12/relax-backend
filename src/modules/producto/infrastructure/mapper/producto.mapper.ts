import { Producto } from '../../domain/entities/producto.entity';
import { ProductoOrmEntity } from '../database/producto.orm-entity';

export class ProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(productoOrm: ProductoOrmEntity): Producto {
    return new Producto({
      id: productoOrm.id,
      nombre: productoOrm.nombre,
      descripcion: productoOrm.descripcion,
      precioCosto: parseFloat(productoOrm.precioCosto.toString()),
      precioVenta: parseFloat(productoOrm.precioVenta.toString()),
      stock: productoOrm.stock,
      stockMinimo: productoOrm.stockMinimo,
      categoria: productoOrm.categoria,
      estado: productoOrm.estado,
      fechaVencimiento: productoOrm.fechaVencimiento,
      lote: productoOrm.lote,
      creadoEn: productoOrm.createdAt,
      actualizadoEn: productoOrm.updatedAt,
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(producto: Producto): ProductoOrmEntity {
    const productoOrm = new ProductoOrmEntity();
    productoOrm.id = producto.getId();
    productoOrm.nombre = producto.getNombre();
    productoOrm.descripcion = producto.getDescripcion();
    productoOrm.precioCosto = producto.getPrecioCosto();
    productoOrm.precioVenta = producto.getPrecioVenta();
    productoOrm.stock = producto.getStock();
    productoOrm.stockMinimo = producto.getStockMinimo();
    productoOrm.categoria = producto.getCategoria();
    productoOrm.estado = producto.getEstado();
    productoOrm.fechaVencimiento = producto.getFechaVencimiento();
    productoOrm.lote = producto.getLote();
    return productoOrm;
  }
}