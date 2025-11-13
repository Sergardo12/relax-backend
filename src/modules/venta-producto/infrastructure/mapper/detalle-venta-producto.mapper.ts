import { DetalleVentaProducto } from '../../domain/entities/detalle-venta-producto.entity';
import { DetalleVentaProductoOrmEntity } from '../database/detalle-venta-producto.orm-entity';
import { ProductoMapper } from '../../../producto/infrastructure/mapper/producto.mapper';
import { ProductoOrmEntity } from '../../../producto/infrastructure/database/producto.orm-entity';
import { VentaProductoOrmEntity } from '../database/venta-producto.orm-entity';

export class DetalleVentaProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(detalleOrm: DetalleVentaProductoOrmEntity): DetalleVentaProducto {
    return new DetalleVentaProducto({
      id: detalleOrm.id,
      producto: ProductoMapper.toDomain(detalleOrm.producto),
      cantidad: detalleOrm.cantidad,
      precioUnitario: parseFloat(detalleOrm.precioUnitario.toString()),
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(detalle: DetalleVentaProducto, idVenta: string ): DetalleVentaProductoOrmEntity {
    const detalleOrm = new DetalleVentaProductoOrmEntity();
    detalleOrm.id = detalle.getId();

    // Relación VentaProducto
    const ventaOrm = new VentaProductoOrmEntity();
    ventaOrm.id = idVenta;
    detalleOrm.venta = ventaOrm;

    // Relación Producto
    const productoOrm = new ProductoOrmEntity();
    productoOrm.id = detalle.getProducto().getId();
    detalleOrm.producto = productoOrm;

    detalleOrm.cantidad = detalle.getCantidad();
    detalleOrm.precioUnitario = detalle.getPrecioUnitario();
    detalleOrm.subtotal = detalle.getSubtotal();
    return detalleOrm;
  }
}