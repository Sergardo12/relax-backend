import { DetalleGasto } from '../../domain/entities/detalle-gasto.entity';
import { DetalleGastoOrmEntity } from '../database/detalle-gasto.orm-entity';
import { RegistroGastoOrmEntity } from '../database/registro-gasto.orm-entity';

export class DetalleGastoMapper {
  // TRAEME DE LA BD HACIA EL OBJETO
  static toDomain(detalleOrm: DetalleGastoOrmEntity): DetalleGasto {
    return new DetalleGasto({
      id: detalleOrm.id,
      descripcion: detalleOrm.descripcion,
      cantidad: detalleOrm.cantidad,
      precioUnitario: parseFloat(detalleOrm.precioUnitario.toString()),
    });
  }

  // DEL OBJETO HACIA LA BD
  static toOrmEntity(
    detalle: DetalleGasto,
    idGasto: string,
  ): DetalleGastoOrmEntity {
    const detalleOrm = new DetalleGastoOrmEntity();
    detalleOrm.id = detalle.getId();

    // Relación RegistroGasto
    const gastoOrm = new RegistroGastoOrmEntity();
    gastoOrm.id = idGasto;
    detalleOrm.gasto = gastoOrm;

    detalleOrm.descripcion = detalle.getDescripcion();
    detalleOrm.cantidad = detalle.getCantidad();
    detalleOrm.precioUnitario = detalle.getPrecioUnitario();
    detalleOrm.subtotal = detalle.getSubtotal();
    return detalleOrm;
  }
}