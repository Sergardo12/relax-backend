import { DetalleCompraProducto } from '../../domain/entities/detalle-compra-producto.entity';
import { DetalleCompraProductoOrmEntity } from '../database/detalle-compra-producto.orm-entity';
import { ProductoMapper } from '../../../producto/infrastructure/mapper/producto.mapper';
import { ProductoOrmEntity } from '../../../producto/infrastructure/database/producto.orm-entity';
import { CompraProductoOrmEntity } from '../database/compra-producto.orm-entity';

export class DetalleCompraProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(detalleOrm: DetalleCompraProductoOrmEntity): DetalleCompraProducto {
    return new DetalleCompraProducto({
      id: detalleOrm.id,
      producto: ProductoMapper.toDomain(detalleOrm.producto),
      cantidad: detalleOrm.cantidad,
      precioCompra: parseFloat(detalleOrm.precioCompra.toString()),
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(
    detalle: DetalleCompraProducto,
    idCompra: string,
  ): DetalleCompraProductoOrmEntity {
    const detalleOrm = new DetalleCompraProductoOrmEntity();
    detalleOrm.id = detalle.getId();

    // Relación CompraProducto
    const compraOrm = new CompraProductoOrmEntity();
    compraOrm.id = idCompra;
    detalleOrm.compra = compraOrm;

    // Relación Producto
    const productoOrm = new ProductoOrmEntity();
    productoOrm.id = detalle.getProducto().getId();
    detalleOrm.producto = productoOrm;

    detalleOrm.cantidad = detalle.getCantidad();
    detalleOrm.precioCompra = detalle.getPrecioCompra();
    detalleOrm.subtotal = detalle.getSubtotal();
    return detalleOrm;
  }
}