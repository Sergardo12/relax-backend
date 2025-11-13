import { Rol } from "../../domain/entities/rol.entity";
import { RolOrmEntity } from "../database/rol.orm-entity";

export class RolMapper{
    static toDomain(rol: RolOrmEntity): Rol{
        return new Rol({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion,
            estado: rol.estado
        });

        // de orm a domain, osea de base de datos a entidad
    }

    static toOrmEntity(rol: Rol): RolOrmEntity{
        const orm = new RolOrmEntity();
        orm.id = rol.getId();
        orm.nombre = rol.nombre;
        orm.descripcion = rol.descripcion;
        orm.estado = rol.getEstado();
        return orm;
    }   

    // de domain a orm, osea de entidad a base de datos
 
}

