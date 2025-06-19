import { UsuarioMapper } from "../../../usuario/infrastructure/mappers/usuario.mapper";
import { Paciente } from "../../domain/entities/paciente.entity";
import { PacienteOrmEntity } from "../database/paciente.orm-entity";



export class PacienteMapper {
    static toDomain(orm: PacienteOrmEntity) : Paciente{
        return new Paciente(
            orm.id,
            UsuarioMapper.toDomain(orm.usuario),
            orm.nombres,
            orm.apellidos,
            orm.dni,
            orm.edad,
            orm.telefono,
            orm.estadoPaciente
        );
    }

    static toOrmEntity(domain: Paciente): PacienteOrmEntity{
        if(!domain.usuario){
            throw new Error ('El paciente debe tener un usuario asignado ')
        }
        const orm = new PacienteOrmEntity();
        orm.id = domain.id || 0
        orm.usuario = UsuarioMapper.toOrmEntity(domain.usuario)
        orm.nombres = domain.nombres
        orm.apellidos = domain.apellidos
        orm.dni = domain.dni
        orm.edad = domain.edad
        orm.telefono = domain.telefono
        orm.estadoPaciente = domain.estadoPaciente

        return orm

    }
}