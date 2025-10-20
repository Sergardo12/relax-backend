import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServicioOrmEntity } from "./infrastructure/database/servicio.orm-entity";
import { EspecialidadModule } from "../especialidad/especialidad.module";
import { ServicioController } from "./presentation/servicio.controller";
import { SERVICIO_REPOSITORY } from "./infrastructure/servicio.repository.token";
import { ServicioRepositoryImpl } from "./infrastructure/repositories/servicio.repository.impl";
import { CrearServicioUseCase } from "./application/use-case/crear-servicio.use-case";

@Module({
    imports:[TypeOrmModule.forFeature([ServicioOrmEntity]), EspecialidadModule],
    controllers: [ServicioController],
    providers:[CrearServicioUseCase,
        {
            provide: SERVICIO_REPOSITORY,
            useClass: ServicioRepositoryImpl
        },
    ],
    exports: [SERVICIO_REPOSITORY]
})
export class ServicioModule{}