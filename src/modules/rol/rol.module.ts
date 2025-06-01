import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolOrmEntity } from "./infrastructure/database/rol.orm-entity";
import { RolController } from "./infrastructure/rol.controller";
import { CrearRolUseCase } from "./application/use-cases/crear-rol.use-case";
import { ROL_REPOSITORY } from "./rol.repository.token";

@Module({
    imports:[TypeOrmModule.forFeature([RolOrmEntity])],
    controllers: [RolController],
    providers :[
            CrearRolUseCase,
            {
                provide: ROL_REPOSITORY,
                // Aquí se inyecta la implementación del repositorio de rol
                useClass: require('./infrastructure/repositories/rol.repository.impl').RolRepositoryImpl
            }
        ],
        exports: [RolModule]
})
export class RolModule{

}