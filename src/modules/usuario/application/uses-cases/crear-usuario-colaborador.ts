import { ConflictException, Inject } from "@nestjs/common";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { USUARIO_REPOSITORY } from "../../infrastructure/usuario.repository.token";
import { ContraseñaService } from "../services/contraseña.service";
import { Usuario } from "../../domain/entities/usuario.entity";
import { CrearUsuarioColaboradorDto } from "../../infrastructure/dto/crearUsuarioColaborador.dto";
import { RolRepository } from "../../../rol/domain/repositories/rol.repository";
import { ROL_REPOSITORY } from "../../../rol/infrastructure/rol.repository.token";

export class CrearUsuarioColaboradorUseCase {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: UsuarioRepository,
        @Inject(ROL_REPOSITORY)
        private readonly rolRepo: RolRepository,
        private readonly contraseñaService: ContraseñaService,
    ){}

    async ejecutar(dto: CrearUsuarioColaboradorDto): Promise<void>{
        const usuarioExistente = await this.usuarioRepo.findByCorreo(dto.correo);

        if (usuarioExistente){
            throw new ConflictException('El usuario ya existe');
        }

        const contraseñaHasheada = await this.contraseñaService.hashearContraseña(dto.contraseña)

        const rolColaborador = await this.rolRepo.findByName('colaborador');
        if(!rolColaborador){throw new ConflictException('El rol de colaborador no existe')}

        const nuevoColaborador = new Usuario({
            correo: dto.correo,
            contraseña: contraseñaHasheada,
            rol: rolColaborador
        });

        await this.usuarioRepo.create(nuevoColaborador, contraseñaHasheada);
    }
}        
