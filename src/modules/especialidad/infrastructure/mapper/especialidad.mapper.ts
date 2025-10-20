import { Especialidad } from "../../domain/entities/especialidad.entity";
import { EspecialidadOrmEntity } from "../database/especialidad.orm-entity";

export class EspecialidadMapper {
    static toDomain(especialidad: EspecialidadOrmEntity): Especialidad {
        return new Especialidad({
            id: especialidad.id,
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion,
            estado: especialidad.estado
            
            
        })
    }

    static toOrmEntity(especialidad: Especialidad): EspecialidadOrmEntity{
        const especialidadOrm = new EspecialidadOrmEntity();
        especialidadOrm.id = especialidad.id,
        especialidadOrm.nombre = especialidad.nombre,
        especialidadOrm.descripcion = especialidad.descripcion,
        especialidadOrm.estado = especialidad.estado

        return especialidadOrm;
    }
}