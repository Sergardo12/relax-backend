import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PacienteOrmEntity } from "./infrastructure/database/paciente.orm-entity";
import { UsuarioModule } from "../usuario/usuario.module";
import { PacienteController } from "./infrastructure/paciente.controller";
import { CrearPacienteUseCase } from "./application/use-cases/crear-paciente.use-case";
import { PACIENTE_REPOSITORY } from "./paciente.repository.token";
import { PacienteRepositoryImpl } from "./infrastructure/repositories/paciente.repository.impl";
import { HistorialMedicoModule } from "../historial-medico/historial-medico.module";
import { CrearHistorialMedicoUseCase } from "../historial-medico/application/use-cases/crear.historial-medico.use-case";


@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteOrmEntity]),
    UsuarioModule,
    forwardRef(() => HistorialMedicoModule),
  ],
  controllers: [PacienteController],
  providers: [
    CrearPacienteUseCase,
    {
      provide: CrearHistorialMedicoUseCase,
      useClass: CrearHistorialMedicoUseCase,
    },
    {
      provide: PACIENTE_REPOSITORY,
      useClass: PacienteRepositoryImpl, // ← Asegúrate de usar tu implementación
    },
  ],
  exports: [PACIENTE_REPOSITORY],
})
export class PacienteModule {}