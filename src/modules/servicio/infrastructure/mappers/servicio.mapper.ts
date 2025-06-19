import { Servicio } from "../../../servicio/domain/entities/servicio.entity";
import { ServicioOrmEntity } from "../../../servicio/infrastructure/database/servicio.orm-entity";

export class ServicioMapper {
  static toDomain(orm: ServicioOrmEntity): Servicio {
    return new Servicio(
      orm.id,
      orm.nombreServicio,
      orm.descripcionServicio,
      orm.precioServicio,
      orm.duracionServicio,
      orm.estadoServicio,
      // 👇 Si luego agregas citas al dominio, aquí lo mapearías también
    );
  }

  static toOrmEntity(domain: Servicio): ServicioOrmEntity {
    const orm = new ServicioOrmEntity();
    if (domain.id !== null) {
      orm.id = domain.id;
    }

    orm.nombreServicio = domain.nombreServicio;
    orm.descripcionServicio = domain.descripcionServicio;
    orm.precioServicio = domain.precioServicio;
    orm.duracionServicio = domain.duracionServicio;
    orm.estadoServicio = domain.estadoServicio;
    // 👇 Las citas se asignan por separado si hace falta
    return orm;
  }
}
