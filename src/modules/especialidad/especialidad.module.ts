import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EspecialidadOrmEntity } from "./infrastructure/database/especialidad.orm-entity";
import { EspecialidadController } from "./presentation/especialidad.controller";
import { CrearEspecialidadUseCase } from "./application/use-cases/crear-especialidad.use-case";
import { ESPECIALIDAD_REPOSITORY } from './infrastructure/especialidad.repository.token';
import { EspecialidadRepositoryImpl } from "./infrastructure/repositories/especialidad.repository.impl";

@Module({
    imports:[ TypeOrmModule.forFeature([EspecialidadOrmEntity])],
    controllers: [EspecialidadController],
    providers:[
        CrearEspecialidadUseCase,
        {
            provide: ESPECIALIDAD_REPOSITORY,
            useClass: EspecialidadRepositoryImpl
        }
    ],
    exports: [ESPECIALIDAD_REPOSITORY, CrearEspecialidadUseCase]
})
export class EspecialidadModule {}