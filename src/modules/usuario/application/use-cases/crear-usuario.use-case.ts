import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { CrearUsuarioDto } from "../../infrastructure/dto/crear-usuario";
import { Usuario } from "../../domain/entities/usuario.entity";
import { USUARIO_REPOSITORY } from "../../usuario.repository.token";

@Injectable()
export class CrearUsuarioUseCase {
    constructor(
        // Inyectamos el repositorio de usuario
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository) {}

    async execute(dto: CrearUsuarioDto): Promise<Usuario> {
        const usuario = new Usuario(
            null,
            dto.correo,
            dto.clave 
        );

        return await this.usuarioRepo.crear(usuario);
        
       
    }
}