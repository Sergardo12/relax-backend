import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioOrmEntity } from "../../modules/usuario/infrastructure/database/usuario-entity.orm";
import { RolModule } from "../rol/rol.module";
import { CrearUsuarioUseCase } from "../../modules/usuario/application/uses-cases/crearUsuario.use-case";
import { UsuarioRepositoryImpl } from "../../modules/usuario/infrastructure/repositories/usuario.repository.impl";
import { UsuarioController } from "../../modules/usuario/presentation/usuario.controller";
import { ContraseñaService } from "../../modules/usuario/application/services/contraseña.service";
import { USUARIO_REPOSITORY } from "../../modules/usuario/infrastructure/usuario.repository.token";
import { PacienteModule } from "../paciente/paciente.module";
import { ColaboradorModule } from "../colaborador/colaborador.module";



@Module({
    imports: [TypeOrmModule.forFeature([UsuarioOrmEntity]),
    RolModule
    ],
    controllers: [UsuarioController],
    providers: [CrearUsuarioUseCase,
        ContraseñaService,
        {
            provide: USUARIO_REPOSITORY,
            useClass: UsuarioRepositoryImpl
        }
    ],
    exports: [USUARIO_REPOSITORY, ContraseñaService]
}) 
export class UsuarioModule {}