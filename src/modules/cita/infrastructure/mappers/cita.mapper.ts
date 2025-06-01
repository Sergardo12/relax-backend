import { Cita } from "../../../cita/domain/entities/cita.entity";
import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";

export class CitaMapper {
    static toDomain(orm: CitaOrmEntity): Cita {
        return new Cita(
            orm.id,
            orm.fecha,
            orm.hora,
            orm.estado
        );
    }

    static toOrmEntity(domain: Cita): CitaOrmEntity {
        const orm = new CitaOrmEntity();
        orm.id = domain.id || 0; // Asumimos 0 si no está definido
        orm.fecha = domain.fecha;
        orm.hora = domain.hora;
        orm.estado = domain.estado;
        return orm;
    }
}
