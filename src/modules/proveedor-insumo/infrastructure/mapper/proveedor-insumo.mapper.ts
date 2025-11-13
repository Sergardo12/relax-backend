import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoOrmEntity } from '../database/proveedor-insumo.orm-entity';

export class ProveedorInsumoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(proveedorOrm: ProveedorInsumoOrmEntity): ProveedorInsumo {
    return new ProveedorInsumo({
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
  static toOrmEntity(proveedor: ProveedorInsumo): ProveedorInsumoOrmEntity {
    const proveedorOrm = new ProveedorInsumoOrmEntity();
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