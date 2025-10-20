import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioColaboradorOrmEntity } from './infrastructure/database/horario-colaborador-entity.orm';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { HorarioColaboradorController } from './presentation/horario-colaborador.controller';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from './infrastructure/horario-colaborador.repository.token';
import { HorarioColaboradorRepositoryImpl } from './infrastructure/repositories/horario-colaborador.repository.impl';
import { HorarioColaboradorService } from './application/services/horario-colaborador.service';
import { CrearHorarioColaboradorUseCase } from './application/use-cases/crear-horario-colaborador.use-case';
import { ListarHorariosPorColaboradorUseCase } from './application/use-cases/listar-horarios-por-colaborador.use-case';
import { ObtenerHorarioColaboradorUseCase } from './application/use-cases/obtener-horario-colaborador.use-case';
import { ActualizarHorarioColaboradorUseCase } from './application/use-cases/actualizar-horario-colaborador.use-case';
import { EliminarHorarioColaboradorUseCase } from './application/use-cases/eliminar-horario-colaborador.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorarioColaboradorOrmEntity]),
    ColaboradorModule,
  ],
  controllers: [HorarioColaboradorController],
  providers: [
    {
      provide: HORARIO_COLABORADOR_REPOSITORY_TOKEN,
      useClass: HorarioColaboradorRepositoryImpl,
    },
    HorarioColaboradorService,
    CrearHorarioColaboradorUseCase,
    ListarHorariosPorColaboradorUseCase,
    ObtenerHorarioColaboradorUseCase,
    ActualizarHorarioColaboradorUseCase,
    EliminarHorarioColaboradorUseCase,
  ],
  exports: [HORARIO_COLABORADOR_REPOSITORY_TOKEN],
})
export class HorarioColaboradorModule {}
