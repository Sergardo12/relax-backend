import { forwardRef, Module } from "@nestjs/common";
import { PacienteModule } from "../paciente/paciente.module";
import { CitaModule } from "../cita/cita.module";
import { HistorialMedicoController } from "./infrastructure/historial-medico.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistorialMedicoOrmEntity } from "./infrastructure/database/historial.orm-entity";
import { CrearHistorialMedicoUseCase } from "./application/use-cases/crear.historial-medico.use-case";
import { HISTORIAL_MEDICO_REPOSITORY } from "./historial-medico.repository.token";
import { HistorialMedicoRepositoryImpl } from "./infrastructure/repository/historial-medico.repository.impl";

@Module({
   imports: [TypeOrmModule.forFeature([HistorialMedicoOrmEntity]), 
   forwardRef(() => PacienteModule), 
   forwardRef(()=> CitaModule)],
   controllers: [HistorialMedicoController],
    providers: [
     CrearHistorialMedicoUseCase,
     {
       provide: HISTORIAL_MEDICO_REPOSITORY,
       useClass: HistorialMedicoRepositoryImpl,
     },
   ],
   exports: [ HISTORIAL_MEDICO_REPOSITORY],
})
export class HistorialMedicoModule {}
