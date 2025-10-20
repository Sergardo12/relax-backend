import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCitaOrmEntity } from './infrastructure/database/detalle-cita-entity.orm';
import { DetalleCitaController } from './presentation/detalle-cita.controller';
import { DETALLE_CITA_REPOSITORY_TOKEN } from './infrastructure/detalle-cita.repository.token';
import { DetalleCitaRepositoryImpl } from './infrastructure/repositories/detalle-cita.repository.impl';
import { DetalleCitaService } from './application/services/detalle-cita.service';
import { CrearDetalleCitaUseCase } from './application/use-cases/crear-detalle-cita.use-case';
import { ListarDetallesPorCitaUseCase } from './application/use-cases/listar-detalles-por-cita.use-case';
import { ObtenerDetalleCitaUseCase } from './application/use-cases/obtener-detalle-cita.use-case';
import { ActualizarObservacionesUseCase } from './application/use-cases/actualizar-observaciones.use-case';
import { EliminarDetalleCitaUseCase } from './application/use-cases/eliminar-detalle-cita.use-case';
import { CitaModule } from '../cita/cita.module';
import { ServicioModule } from '../servicio/servicio.module';
import { ColaboradorModule } from '../colaborador/colaborador.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleCitaOrmEntity]),
    CitaModule,
    ServicioModule,
    ColaboradorModule,
  ],
  controllers: [DetalleCitaController],
  providers: [
    DetalleCitaService,
    CrearDetalleCitaUseCase,
    ListarDetallesPorCitaUseCase,
    ObtenerDetalleCitaUseCase,
    ActualizarObservacionesUseCase,
    EliminarDetalleCitaUseCase,
    {
      provide: DETALLE_CITA_REPOSITORY_TOKEN,
      useClass: DetalleCitaRepositoryImpl,
    },
  ],
  exports: [DETALLE_CITA_REPOSITORY_TOKEN],
})
export class DetalleCitaModule {}
