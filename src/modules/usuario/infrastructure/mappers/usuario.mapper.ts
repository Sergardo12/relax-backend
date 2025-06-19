import { RolMapper } from "../../../rol/infrastructure/mappers/rol.mapper";
import { Usuario } from "../../domain/entities/usuario.entity";
import { UsuarioOrmEntity } from "../database/usuario.orm-entity";

export class UsuarioMapper {
  static toDomain(orm: UsuarioOrmEntity): Usuario {
    return new Usuario(
      orm.id,
      orm.correo,
      orm.clave,
      RolMapper.toDomain(orm.rol), // ✅ sin asignación
    );
  }

  static toOrmEntity(domain: Usuario): UsuarioOrmEntity {
    if (!domain.rol || !domain.correo || !domain.clave) {
      throw new Error('Usuario debe tener rol, correo y clave asignados');
    }

    const orm = new UsuarioOrmEntity();
    orm.id = domain.id || 0;
    orm.correo = domain.correo;
    orm.clave = domain.clave;
    orm.rol = RolMapper.toOrmEntity(domain.rol);

    return orm;
  }
}



    
