import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EspecialidadOrmEntity } from "./infrastructure/database/especialidad.orm-entity";
import { EspecialidadController } from "./presentation/especialidad.controller";
import { CrearEspecialidadUseCase } from "./application/use-cases/crear-especialidad.use-case";
import { ESPECIALIDAD_REPOSITORY } from './infrastructure/especialidad.repository.token';
import { EspecialidadRepositoryImpl } from "./infrastructure/repositories/especialidad.repository.impl";
import { ListarEspecialidadesUseCase } from "./application/use-cases/listar-especialidades.use-case";
import { ObtenerEspecialidadPorId } from "./application/use-cases/obtener-especialidad.use-case";

@Module({
    imports:[ TypeOrmModule.forFeature([EspecialidadOrmEntity])],
    controllers: [EspecialidadController],
    providers:[
        CrearEspecialidadUseCase,
        ListarEspecialidadesUseCase,
        ObtenerEspecialidadPorId,
        {
            provide: ESPECIALIDAD_REPOSITORY,
            useClass: EspecialidadRepositoryImpl
        }
    ],
    exports: [ESPECIALIDAD_REPOSITORY, CrearEspecialidadUseCase]
})
export class EspecialidadModule {}