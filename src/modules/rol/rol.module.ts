import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolOrmEntity } from "../../modules/rol/infrastructure/database/rol.orm-entity";
import { RolController } from "../../modules/rol/presentation/rol.controller";
import { CrearRolUseCase } from "../../modules/rol/application/uses-cases/CrearRol.use-case";
import { RolRepositoryImpl } from "../../modules/rol/infrastructure/repositories/rol.repository.impl";
import { ROL_REPOSITORY } from "../rol/infrastructure/rol.repository.token";

@Module({
    imports: [TypeOrmModule.forFeature([RolOrmEntity])],
    controllers: [RolController],
    providers: [
        CrearRolUseCase,
        {
            provide: ROL_REPOSITORY,
            useClass: RolRepositoryImpl
        }
    ],
    exports: [ROL_REPOSITORY]
})
export class RolModule {}