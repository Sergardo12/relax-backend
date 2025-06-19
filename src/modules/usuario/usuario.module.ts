import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioOrmEntity } from "./infrastructure/database/usuario.orm-entity";
import { UsuarioController } from "./infrastructure/usuario.controller";
import { CrearUsuarioUseCase } from "./application/use-cases/crear-usuario.use-case";
import { USUARIO_REPOSITORY } from "./usuario.repository.token";
import { RolModule } from "../rol/rol.module";

@Module({
    imports: [TypeOrmModule.forFeature([UsuarioOrmEntity]), RolModule], // Aquí puedes agregar las entidades que necesites
    controllers: [UsuarioController],
    providers: [
        CrearUsuarioUseCase,
        {
            provide: USUARIO_REPOSITORY,
            // Aquí se inyecta la implementación del repositorio de usuario
            useClass: require('./infrastructure/repositories/usuario.repository.impl').UsuarioRepositoryImpl
        }
    ],
    exports: [USUARIO_REPOSITORY]
})
export class UsuarioModule {
    // Este módulo puede importar otros módulos, definir controladores y proveedores según sea necesario.
    // Por ejemplo, si tienes un controlador y un servicio para manejar usuarios, los puedes agregar aquí.
}