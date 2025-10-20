import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { ContraseñaService } from "../services/contraseña.service";
import { CrearUsuarioDTO } from "../../infrastructure/dto/crearUsuario.dto";
import { USUARIO_REPOSITORY } from "../../infrastructure/usuario.repository.token";
import { Usuario } from "../../domain/entities/usuario.entity";
import { ROL_REPOSITORY } from "src/modules/rol/infrastructure/rol.repository.token";
import { RolRepository } from "src/modules/rol/domain/repositories/rol.repository";


@Injectable()
export class CrearUsuarioUseCase {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepository: UsuarioRepository,
        @Inject(ROL_REPOSITORY)
        private readonly rolRepo: RolRepository,
        private readonly contraseñaService: ContraseñaService
    ) {}

    async ejecutar(dto: CrearUsuarioDTO): Promise<void> {
        // Verificar si el usuario ya existe
        const usuarioExistente = await this.usuarioRepository.findByCorreo(dto.correo);
        if (usuarioExistente) {
            throw new ConflictException('El usuario ya existe');
        }

        // Verificar si el rol existe
        const rol = await this.rolRepo.findById(dto.rolId);
        if (!rol) {
          throw new ConflictException('El rol especificado no existe');
        }

        // Primero hasehamosos la contraseña
        // Luego creamos el usuario
        const contraseñaHasheada = await this.contraseñaService.hashearContraseña(dto.contraseña);
        const nuevoUsuario = new Usuario({
            correo: dto.correo,
            contraseña: contraseñaHasheada,
            rol: rol
        });

        // Finalmente, guardamos el usuario en la base de datos
        await this.usuarioRepository.create(nuevoUsuario, contraseñaHasheada);
    }
}