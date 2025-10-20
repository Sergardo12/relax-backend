import { ConsumoBeneficio } from '../../domain/entities/consumo-beneficio.entity';
import { ConsumoBeneficioOrmEntity } from '../database/consumo-beneficio.orm-entity';
import { SuscripcionMapper } from '../../../suscripcion/infrastructure/mapper/suscripcion.mapper';
import { ServicioMapper } from '../../../servicio/infrastructure/mapper/servicio.mapper';
import { SuscripcionOrmEntity } from '../../../suscripcion/infrastructure/database/suscripcion.orm-entity';
import { ServicioOrmEntity } from '../../../servicio/infrastructure/database/servicio.orm-entity';

export class ConsumoBeneficioMapper {
  static toDomain(consumoBeneficio: ConsumoBeneficioOrmEntity): ConsumoBeneficio {
    return new ConsumoBeneficio({
      id: consumoBeneficio.id,
      suscripcion: SuscripcionMapper.toDomain(consumoBeneficio.suscripcion),
      servicio: ServicioMapper.toDomain(consumoBeneficio.servicio),
      cantidadTotal: consumoBeneficio.cantidadTotal,
      cantidadConsumida: consumoBeneficio.cantidadConsumida,
      cantidadDisponible: consumoBeneficio.cantidadDisponible,
    });
  }

  static toOrmEntity(consumo: ConsumoBeneficio): ConsumoBeneficioOrmEntity {
    const consumoBeneficioOrm = new ConsumoBeneficioOrmEntity();
    consumoBeneficioOrm.id = consumo.getId();

    // Relación Suscripcion
    const suscripcionOrm = new SuscripcionOrmEntity();
    suscripcionOrm.id = consumo.getSuscripcion().getId();
    consumoBeneficioOrm.suscripcion = suscripcionOrm;

    // Relación Servicio
    const servicioOrm = new ServicioOrmEntity();
    servicioOrm.id = consumo.getServicio().id;
    consumoBeneficioOrm.servicio = servicioOrm;

    consumoBeneficioOrm.cantidadTotal = consumo.getCantidadTotal();
    consumoBeneficioOrm.cantidadConsumida = consumo.getCantidadConsumida();
    consumoBeneficioOrm.cantidadDisponible = consumo.getCantidadDisponible();
    return consumoBeneficioOrm;
  }
}