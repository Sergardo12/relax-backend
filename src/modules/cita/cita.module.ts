import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaOrmEntity } from './infrastructure/database/cita.orm-entity';
import { CITA_REPOSITORY } from './cita.repository.token';
import { CitaController } from './infrastructure/cita.controller';
import { CrearCitaUseCase } from './application/use-cases/crear-cita.use-case';
import { CitaRepositoryImpl } from './infrastructure/repositories/cita.repository.impl';
import { PacienteModule } from '../paciente/paciente.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { ServicioModule } from '../servicio/servicio.module';
import { HistorialMedicoModule } from '../historial-medico/historial-medico.module';

@Module({
  imports: [TypeOrmModule.forFeature([CitaOrmEntity]), 
  forwardRef(() => PacienteModule), 
  ColaboradorModule, 
  ServicioModule,
  forwardRef(() => HistorialMedicoModule)],
  controllers: [CitaController],
   providers: [
    CrearCitaUseCase,
    {
      provide: CITA_REPOSITORY,
      useClass: CitaRepositoryImpl,
    },
  ],
  exports: [ CITA_REPOSITORY],
})
export class CitaModule {}
