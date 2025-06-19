import { UsuarioMapper } from "../../../usuario/infrastructure/mappers/usuario.mapper";
import { Colaborador } from "../../domain/entities/colaborador.entity";
import { ColaboradorOrmEntity } from "../database/colaborador.orm-entity";

export class ColaboradorMapper {
    static toDomain(orm: ColaboradorOrmEntity): Colaborador {
        return new Colaborador(
            orm.id,
            UsuarioMapper.toDomain(orm.usuario),
            orm.nombres,
            orm.apellidos,
            orm.dni,
            orm.telefono,
            orm.fecha_contratacion,
            orm.estadoColaborador
        );
    }

    static toOrmEntity(domain: Colaborador): ColaboradorOrmEntity {
        if(!domain.usuario){
            throw new Error ('El colaborador debe tener un usuario asignado ')
        }
        const orm = new ColaboradorOrmEntity();
        orm.id = domain.id || 0
        orm.usuario = UsuarioMapper.toOrmEntity(domain.usuario)
        orm.nombres = domain.nombres
        orm.apellidos = domain.apellidos
        orm.dni = domain.dni
        orm.telefono = domain.telefono
        orm.fecha_contratacion = domain.fecha_contratacion
        orm.estadoColaborador = domain.estadoColaborador
    
        return orm
    }
}
