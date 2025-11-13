import { RegistroGasto } from '../../domain/entities/registro-gasto.entity';
import { RegistroGastoOrmEntity } from '../database/registro-gasto.orm-entity';
import { ProveedorInsumoMapper } from '../../../proveedor-insumo/infrastructure/mapper/proveedor-insumo.mapper';
import { ProveedorInsumoOrmEntity } from '../../../proveedor-insumo/infrastructure/database/proveedor-insumo.orm-entity';

export class RegistroGastoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(gastoOrm: RegistroGastoOrmEntity): RegistroGasto {
    return new RegistroGasto({
      id: gastoOrm.id,
      proveedor: ProveedorInsumoMapper.toDomain(gastoOrm.proveedor),
      fecha: gastoOrm.fecha,
      categoria: gastoOrm.categoria,
      tipoComprobante: gastoOrm.tipoComprobante,
      numeroComprobante: gastoOrm.numeroComprobante,
      total: parseFloat(gastoOrm.total.toString()),
      estado: gastoOrm.estado,
      observaciones: gastoOrm.observaciones,
      creadoEn: gastoOrm.createdAt,
      actualizadoEn: gastoOrm.updatedAt,
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(gasto: RegistroGasto): RegistroGastoOrmEntity {
    const gastoOrm = new RegistroGastoOrmEntity();
    gastoOrm.id = gasto.getId();

    // Relación Proveedor
    const proveedorOrm = new ProveedorInsumoOrmEntity();
    proveedorOrm.id = gasto.getProveedor().getId();
    gastoOrm.proveedor = proveedorOrm;

    gastoOrm.fecha = gasto.getFecha();
    gastoOrm.categoria = gasto.getCategoria();
    gastoOrm.tipoComprobante = gasto.getTipoComprobante();
    gastoOrm.numeroComprobante = gasto.getNumeroComprobante();
    gastoOrm.total = gasto.getTotal();
    gastoOrm.estado = gasto.getEstado();
    gastoOrm.observaciones = gasto.getObservaciones();
    return gastoOrm;
  }
}