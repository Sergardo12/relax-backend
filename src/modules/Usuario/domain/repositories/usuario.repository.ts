import { Usuario } from "../../../usuario/domain/entities/usuario.entity";


export interface UsuarioRepository {
    create (usuario: Usuario, contraseñaHasheada: string): Promise<Usuario>;
    findById (id: string): Promise<Usuario | null>;
    findByCorreo (correo: string): Promise<Usuario | null>;
    findAll(): Promise<Usuario[]>;
    update (usuario: Usuario): Promise<Usuario>;
    updateContraseña(id: string, contraseñaHasheada: string): Promise<void>; // Nuevo método para actualizar solo la contraseña
    marcarPerfilCompleto(id: string): Promise<void>;
    delete (id: string): Promise<void>;
}