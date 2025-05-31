import { Usuario } from "../../domain/entities/usuario.entity";
import { UsuarioOrmEntity } from "../database/usuario.orm-entity";

export class UsuarioMapper {
    static toDamain(orm: UsuarioOrmEntity): Usuario {
        return new Usuario(
            orm.id,
            orm.correo,
            orm.clave
        );
    }


    static toOrmEntity(domain: Usuario): UsuarioOrmEntity {
        const orm = new UsuarioOrmEntity();
        orm.id = domain.id || 0; // Assuming id can be 0 if not set
        orm.correo = domain.correo;
        orm.clave = domain.clave;
        return orm;
    }
    
}



    
