import { Servicio } from "../../../servicio/domain/entities/servicio.entity";
import { ServicioOrmEntity } from "../../../servicio/infrastructure/database/servicio.orm-entity";

export class ServicioMapper {
    static toDomain(orm: ServicioOrmEntity): Servicio {
        return new Servicio(
            orm.id,
            orm.nombreservicio,
            orm.descripcionservicio,
            orm.precioservicio,
            orm.duracion
        );
    }

    static toOrmEntity(domain: Servicio): ServicioOrmEntity {
        const orm = new ServicioOrmEntity();
        orm.id = domain.id || 0; // o usa domain.id ?? undefined si prefieres
        orm.nombreservicio = domain.nombreservicio;
        orm.descripcionservicio = domain.descripcionservicio;
        orm.precioservicio = domain.precioservicio;
        orm.duracion = domain.duracion;
        return orm;
    }
}
