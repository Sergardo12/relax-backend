import { Usuario } from "../entities/usuario.entity";

export interface UsuarioRepository {
    crear(usuario: Usuario): Promise<Usuario>;

      buscarPorId(id: number): Promise<Usuario | null>;
    
}