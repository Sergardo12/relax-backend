import { EspecialidadMapper } from "src/modules/especialidad/infrastructure/mapper/especialidad.mapper";
import { Servicio } from "../../domain/entities/servicio.entity";
import { ServicioOrmEntity } from "../database/servicio.orm-entity";
import { EspecialidadOrmEntity } from "src/modules/especialidad/infrastructure/database/especialidad.orm-entity";

export class ServicioMapper{
    static toDomain(servicio: ServicioOrmEntity): Servicio{
        return new Servicio ({
            id: servicio.id,
            especialidad: EspecialidadMapper.toDomain(servicio.especialidad),
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            precio: servicio.precio,
            duracion: servicio.duracion,
            estado: servicio.estado
        })
    }

    static toOrmEntity(servicio: Servicio ): ServicioOrmEntity{
        const servicioOrm = new ServicioOrmEntity()
        servicioOrm.id = servicio.id

        const especialiadOrm = new EspecialidadOrmEntity();
        especialiadOrm.id = servicio.especialidad.id
        servicioOrm.especialidad = especialiadOrm

        servicioOrm.nombre = servicio.nombre
        servicioOrm.descripcion = servicio.descripcion
        servicioOrm.precio = servicio.precio
        servicioOrm.duracion = servicio.duracion
        servicioOrm.estado = servicio.estado

        return servicioOrm
    }
}