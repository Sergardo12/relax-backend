import { VentaProducto } from '../../domain/entities/venta-producto.entity';
import { VentaProductoOrmEntity } from '../database/venta-producto.orm-entity';

export class VentaProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(ventaOrm: VentaProductoOrmEntity): VentaProducto {
    return new VentaProducto({
      id: ventaOrm.id,
      fecha: ventaOrm.fecha,
      tipoComprobante: ventaOrm.tipoComprobante,
      numeroComprobante: ventaOrm.numeroComprobante,
      metodoPago: ventaOrm.metodoPago,
      subtotal: parseFloat(ventaOrm.subtotal.toString()),
      descuento: parseFloat(ventaOrm.descuento.toString()),
      igv: parseFloat(ventaOrm.igv.toString()),
      total: parseFloat(ventaOrm.total.toString()),
      estado: ventaOrm.estado,
      clienteNombre: ventaOrm.clienteNombre,
      clienteDocumento: ventaOrm.clienteDocumento,
      observaciones: ventaOrm.observaciones,
      creadoEn: ventaOrm.createdAt,
      actualizadoEn: ventaOrm.updatedAt,
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(venta: VentaProducto): VentaProductoOrmEntity {
    const ventaOrm = new VentaProductoOrmEntity();
    ventaOrm.id = venta.getId();
    ventaOrm.fecha = venta.getFecha();
    ventaOrm.tipoComprobante = venta.getTipoComprobante();
    ventaOrm.numeroComprobante = venta.getNumeroComprobante();
    ventaOrm.metodoPago = venta.getMetodoPago();
    ventaOrm.subtotal = venta.getSubtotal();
    ventaOrm.descuento = venta.getDescuento();
    ventaOrm.igv = venta.getIgv();
    ventaOrm.total = venta.getTotal();
    ventaOrm.estado = venta.getEstado();
    ventaOrm.clienteNombre = venta.getClienteNombre();
    ventaOrm.clienteDocumento = venta.getClienteDocumento();
    ventaOrm.observaciones = venta.getObservaciones();
    return ventaOrm;
  }
}