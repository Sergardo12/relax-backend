import { Module } from "@nestjs/common";
import { SesionTratamientoOrmEntity } from "./infrastructure/database/sesion-tratamiento.orm-entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SesionTratamientoController } from "./presentation/sesion-tratamiento.controller";
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from './infrastructure/sesion-tratamiento.repository.token';
import { SesionTratamientoRepositoryImpl } from "./infrastructure/repositories/sesion-tratamiento.repository.impl";
import { SesionTratamientoService } from "./application/services/sesion-tratamiento.service";
import { CrearSesionTratamientoUseCase } from "./application/uses-cases/crear-sesion-tratamiento.use-case";
import { ObtenerSesionTratamientoUseCase } from "./application/uses-cases/obtener-sesion-tratamiento.use-case";
import { ListarSesionesTratamientoUseCase } from "./application/uses-cases/listar-sesion-tratamiento.use-case";
import { CompletarSesionTratamientoUseCase } from "./application/uses-cases/completar-sesion-tratamiento.use-case";
import { ActualizarSesionTratamientoUseCase } from "./application/uses-cases/actualizar-sesion-tratamiento.use-case";
import { CancelarSesionTratamientoUseCase } from "./application/uses-cases/cancelar-sesion-tratamiento.use-case";
import { TratamientoModule } from "../tratamiento/tratamiento.module";

@Module({
    imports: [TypeOrmModule.forFeature([SesionTratamientoOrmEntity]), 
    TratamientoModule],
    controllers: [SesionTratamientoController],
    providers:[{
        provide: SESION_TRATAMIENTO_REPOSITORY_TOKEN,
        useClass: SesionTratamientoRepositoryImpl
    },
    SesionTratamientoService,
    CrearSesionTratamientoUseCase,
    ObtenerSesionTratamientoUseCase,
    ListarSesionesTratamientoUseCase,
    CompletarSesionTratamientoUseCase,
    ActualizarSesionTratamientoUseCase,
    CancelarSesionTratamientoUseCase,
],
    exports: [SESION_TRATAMIENTO_REPOSITORY_TOKEN, SesionTratamientoService],
})
export class SesionTratamientoModule {}