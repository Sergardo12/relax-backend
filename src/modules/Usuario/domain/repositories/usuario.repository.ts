import { Usuario } from "../entities/usuario.entity";

export interface UsuarioRepository {
    create (usuario: Usuario, contraseñaHasheada: string): Promise<Usuario>;
    findById (id: string): Promise<Usuario | null>;
    findByCorreo (correo: string): Promise<Usuario | null>;
    update (usuario: Usuario): Promise<Usuario>;
    updateContraseña(id: string, contraseñaHasheada: string): Promise<void>; // Nuevo método para actualizar solo la contraseña
    delete (id: string): Promise<void>;
}