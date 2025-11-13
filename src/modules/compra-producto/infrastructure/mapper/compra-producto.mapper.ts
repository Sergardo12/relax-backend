import { ProveedorProductoMapper } from 'src/modules/proveedor-producto/infrastructure/mapper/proveedor-producto.mapper';
import { CompraProducto } from '../../domain/entities/compra-producto.entity';
import { CompraProductoOrmEntity } from '../database/compra-producto.orm-entity';
import { ProveedorProductoOrmEntity } from 'src/modules/proveedor-producto/infrastructure/database/proveedor-producto.orm-entity';


export class CompraProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(compraOrm: CompraProductoOrmEntity): CompraProducto {
    return new CompraProducto({
      id: compraOrm.id,
      proveedor: ProveedorProductoMapper.toDomain(compraOrm.proveedor),
      fecha: compraOrm.fecha,
      tipoComprobante: compraOrm.tipoComprobante,
      numeroComprobante: compraOrm.numeroComprobante,
      total: parseFloat(compraOrm.total.toString()),
      estado: compraOrm.estado,
      observaciones: compraOrm.observaciones,
      creadoEn: compraOrm.createdAt,
      actualizadoEn: compraOrm.updatedAt,
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(compra: CompraProducto): CompraProductoOrmEntity {
    const compraOrm = new CompraProductoOrmEntity();
    compraOrm.id = compra.getId();

    // Relación Proveedor
    const proveedorOrm = new ProveedorProductoOrmEntity();
    proveedorOrm.id = compra.getProveedor().getId();
    compraOrm.proveedor = proveedorOrm;

    compraOrm.fecha = compra.getFecha();
    compraOrm.tipoComprobante = compra.getTipoComprobante();
    compraOrm.numeroComprobante = compra.getNumeroComprobante();
    compraOrm.total = compra.getTotal();
    compraOrm.estado = compra.getEstado();
    compraOrm.observaciones = compra.getObservaciones();
    return compraOrm;
  }
}