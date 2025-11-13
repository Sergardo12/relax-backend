import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';
import { ProveedorProductoOrmEntity } from '../database/proveedor-producto.orm-entity';

export class ProveedorProductoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(proveedorOrm: ProveedorProductoOrmEntity): ProveedorProducto {
    return new ProveedorProducto({
      id: proveedorOrm.id,
      nombre: proveedorOrm.nombre,
      ruc: proveedorOrm.ruc,
      telefono: proveedorOrm.telefono,
      email: proveedorOrm.email,
      direccion: proveedorOrm.direccion,
      estado: proveedorOrm.estado,
      creadoEn: proveedorOrm.createdAt,
      actualizadoEn: proveedorOrm.updatedAt,
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(proveedor: ProveedorProducto): ProveedorProductoOrmEntity {
    const proveedorOrm = new ProveedorProductoOrmEntity();
    proveedorOrm.id = proveedor.getId();
    proveedorOrm.nombre = proveedor.getNombre();
    proveedorOrm.ruc = proveedor.getRuc();
    proveedorOrm.telefono = proveedor.getTelefono();
    proveedorOrm.email = proveedor.getEmail();
    proveedorOrm.direccion = proveedor.getDireccion();
    proveedorOrm.estado = proveedor.getEstado();
    return proveedorOrm;
  }
}
