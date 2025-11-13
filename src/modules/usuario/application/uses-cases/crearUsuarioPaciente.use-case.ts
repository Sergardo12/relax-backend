import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { CrearUsuarioPacienteDTO } from "../../../usuario/infrastructure/dto/crearUsuarioPaciente.dto";
import { Usuario } from "../../../usuario/domain/entities/usuario.entity";
import { ContraseñaService } from "../services/contraseña.service";
import { USUARIO_REPOSITORY } from "../../infrastructure/usuario.repository.token";
import { RolRepository } from "src/modules/rol/domain/repositories/rol.repository";
import { ROL_REPOSITORY } from "src/modules/rol/infrastructure/rol.repository.token";


@Injectable()
export class CrearUsuarioPacienteUseCase {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository,
        @Inject(ROL_REPOSITORY)
        private readonly rolRepo: RolRepository,
        private readonly contraseñaService: ContraseñaService){}

    async ejecutar(dto: CrearUsuarioPacienteDTO): Promise<void>{
         // Verificar si el usuario ya existe
        const usuarioExistente = await this.usuarioRepo.findByCorreo(dto.correo);
        if (usuarioExistente) {
            throw new ConflictException('El usuario ya existe');
        }

        // Hashear la contraseña
        const contraseñaHasheada = await this.contraseñaService.hashearContraseña(dto.contraseña);

        // Buscar el rol de paciente
        const rolPaciente = await this.rolRepo.findByName('paciente');
        if (!rolPaciente) {
            throw new ConflictException('El rol de paciente no existe');
        }
        //Creamos el usuario
        const nuevoUsuario = new Usuario({
            correo: dto.correo,
            contraseña: contraseñaHasheada,
            rol: rolPaciente,
        });

        //Guardamos el usuario en la base de datos
        await this.usuarioRepo.create(nuevoUsuario, contraseñaHasheada);

    }
}
