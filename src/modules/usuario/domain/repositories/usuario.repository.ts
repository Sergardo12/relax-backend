import { Usuario } from "../entities/usuario.entity";

export interface UsuarioRepository {
    crear(usuario: Usuario): Promise<Usuario>;
}