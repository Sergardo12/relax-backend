import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaOrmEntity } from './infrastructure/database/cita-entity.orm';
import { CitaController } from './presentation/cita.controller';
import { CITA_REPOSITORY } from './infrastructure/cita.repository.token';
import { CitaRepositoryImpl } from './infrastructure/repositories/cita.repository.impl';
import { CitaService } from './application/services/cita.service';
import { CrearCitaUseCase } from './application/use-cases/crear-cita.use-case';
import { ListarCitasUseCase } from './application/use-cases/listar-citas.use-case';
import { ObtenerCitaPorIdUseCase } from './application/use-cases/obtener-cita-por-id.use-case';
import { ActualizarCitaUseCase } from './application/use-cases/actualizar-cita.use-case';
import { CancelarCitaUseCase } from './application/use-cases/cancelar-cita.use-case';
import { PacienteModule } from '../paciente/paciente.module';
import { ListarMisCitasUseCase } from './application/use-cases/listar-mis-citas.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CitaOrmEntity]), PacienteModule],
  controllers: [CitaController],
  providers: [
    CitaService,
    CrearCitaUseCase,
    ListarCitasUseCase,
    ObtenerCitaPorIdUseCase,
    ActualizarCitaUseCase,
    CancelarCitaUseCase,
    ListarMisCitasUseCase,
    {
      provide: CITA_REPOSITORY,
      useClass: CitaRepositoryImpl,
    },
  ],
  exports: [CITA_REPOSITORY],
})
export class CitaModule {}
