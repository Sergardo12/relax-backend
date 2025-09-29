import { Usuario } from "../../domain/entities/usuario.entity";
import { UsuarioOrmEntity } from "../database/usuario-entity.orm";
import { RolMapper } from '../../../Rol/infrastructure/mapper/rol.mapper';

export class UsuarioMapper {
    
    static toDomain(usuario: UsuarioOrmEntity): Usuario{
        return new Usuario({
            id: usuario.id,
            correo: usuario.correo,
            contraseña: usuario.contraseña,
            rol: RolMapper.toDomain(usuario.rol),
            estado: usuario.estado 
        });
    }

     // Para create (necesita la contraseña)
    static toOrmEntity(usuario: Usuario, contraseñaHasheada: string): UsuarioOrmEntity {
        const usuarioOrm = new UsuarioOrmEntity();
        usuarioOrm.id = usuario.getId();
        usuarioOrm.correo = usuario.correo;
        usuarioOrm.contraseña = contraseñaHasheada;
        usuarioOrm.rolId = usuario.getRol().getId(),
        usuarioOrm.estado = usuario.getEstado();
        return usuarioOrm;
    }

    // Para update sin contraseña
    static toOrmEntityWithoutPassword(usuario: Usuario): UsuarioOrmEntity {
        const usuarioOrm = new UsuarioOrmEntity();
        usuarioOrm.id = usuario.getId();
        usuarioOrm.correo = usuario.correo;
        usuarioOrm.rolId = usuario.getRol().getId(),
        usuarioOrm.estado = usuario.getEstado();
        return usuarioOrm;
    }
}