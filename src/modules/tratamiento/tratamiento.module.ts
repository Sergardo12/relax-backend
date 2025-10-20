import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TratamientoOrmEntity } from "./infrastructure/database/tratamiento.orm-entity";
import { CitaModule } from "../cita/cita.module";
import { ColaboradorModule } from "../colaborador/colaborador.module";
import { PacienteModule } from "../paciente/paciente.module";
import { TratamientoController } from "./presentation/tratamiento.controller";
import { TRATAMIENTO_REPOSITORY_TOKEN } from './infrastructure/tratamiento.repository.token';
import { TratamientoRepositoryImpl } from "./infrastructure/repositories/tratamiento.repository.impl";
import { TratamientoService } from "./application/service/tratamiento.service";
import { CrearTratamientoUseCase } from "./application/use-cases/crear-tratamiento.use-case";
import { ObtenerTratamientoUseCase } from "./application/use-cases/obtener-tratamiento.use-case";
import { ListarTratamientosPacienteUseCase } from "./application/use-cases/listar-tratamientos-paciente.use-case";
import { ActualizarTratamientoUseCase } from "./application/use-cases/actualizar-tratamiento.use-case";
import { CancelarTratamientoUseCase } from "./application/use-cases/cancelar-tratamiento.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([TratamientoOrmEntity]),
    CitaModule,
    ColaboradorModule,
    PacienteModule,],
    controllers: [TratamientoController],
    providers: [
        {
            provide: TRATAMIENTO_REPOSITORY_TOKEN,
            useClass: TratamientoRepositoryImpl
        },
        TratamientoService,
        CrearTratamientoUseCase,
        ObtenerTratamientoUseCase,
        ListarTratamientosPacienteUseCase,
        ActualizarTratamientoUseCase,
        CancelarTratamientoUseCase
    ],
    exports: [TRATAMIENTO_REPOSITORY_TOKEN, TratamientoService],
})
export class TratamientoModule {}