import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioOrmEntity } from "./infrastructure/database/usuario-entity.orm";
import { RolModule } from "../Rol/rol.module";
import { UsuarioController } from "./presentation/usuario.controller";
import { CrearUsuarioUseCase } from "./application/uses-cases/crearUsuario.use-case";
import { USUARIO_REPOSITORY } from "./infrastructure/usuario.repository.token";
import { UsuarioRepositoryImpl } from "./infrastructure/repositories/usuario.repository.impl";
import { ContraseñaService } from "./application/services/contraseña.service";

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
    exports: [USUARIO_REPOSITORY]
}) 
export class UsuarioModule {}