import { Colaborador } from "../../domain/entities/colaborador.entity";
import { ColaboradorOrmEntity } from "../database/colaborador.orm-entity";

export class ColaboradorMapper {
    static toDomain(orm: ColaboradorOrmEntity): Colaborador {
        return new Colaborador(
            orm.idColaborador,
            orm.dni,
            orm.nombres,
            orm.apellidos,
            orm.telefono,
            orm.email,
            orm.password_hash,
            orm.fecha_contratacion,
            orm.estado,
            orm.tipo
        );
    }

    static toOrmEntity(domain: Colaborador): ColaboradorOrmEntity {
        const orm = new ColaboradorOrmEntity();
        orm.idColaborador = domain.idColaborador || 0;
        orm.dni = domain.dni;
        orm.nombres = domain.nombres;
        orm.apellidos = domain.apellidos;
        orm.telefono = domain.telefono;
        orm.email = domain.email;
        orm.password_hash = domain.password_hash;
        orm.fecha_contratacion = domain.fecha_contratacion;
        orm.estado = domain.estado;
        orm.tipo = domain.tipo;
        return orm;
    }
}
