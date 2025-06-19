import { Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { CrearUsuarioDto } from "../../infrastructure/dto/crear-usuario";
import { Usuario } from "../../domain/entities/usuario.entity";
import { USUARIO_REPOSITORY } from "../../usuario.repository.token";
import { ROL_REPOSITORY } from "../../../rol/rol.repository.token";
import { RolRepository } from "../../../rol/domain/repositories/rol.repository";

@Injectable()
export class CrearUsuarioUseCase {
    constructor(
        // Inyectamos el repositorio de usuario
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository,
    
        @Inject(ROL_REPOSITORY)
        private readonly rolRepo: RolRepository) {}

    async execute(dto: CrearUsuarioDto): Promise<Usuario> {
        // 1. Obtener rol por su ID
        const rol = await this.rolRepo.obtenerPorId(dto.rolId)

        if(!rol){
            throw new Error(`Rol con ID ${dto.rolId} no encontrado`);
        }

        // 2. Crear el usuario con el rol completo
        const usuario = new Usuario(
            null,
            dto.correo,
            dto.clave,
            rol // Aqui pasamos el objeto Rol
        );

        return await this.usuarioRepo.crear(usuario);
        
       
    }
}

