import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolOrmEntity } from "./infrastructure/database/rol.orm-entity";
import { RolController } from "./presentation/rol.controller";
import { CrearRolUseCase } from "./application/uses-cases/CrearRol.use-case";
import { ROL_REPOSITORY } from "./infrastructure/rol.repository.token";
import { RolRepositoryImpl } from "./infrastructure/repositories/rol.repository.impl";

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