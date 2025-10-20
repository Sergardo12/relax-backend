import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PagoCitaOrmEntity } from './infrastructure/database/pago-cita-entity.orm';
import { PagoCitaController } from './presentation/pago-cita.controller';
import { WebhookController } from './presentation/webhook.controller';
import { PAGO_CITA_REPOSITORY_TOKEN } from './infrastructure/pago-cita.repository.token';
import { PagoCitaRepositoryImpl } from './infrastructure/repositories/pago-cita.repository.impl';
import { PagoCitaService } from './application/services/pago-cita.service';
import { PagarConTarjetaUseCase } from './application/use-cases/pagar-con-tarjeta.use-case';
import { PagarConYapeUseCase } from './application/use-cases/pagar-con-yape.use-case';
import { PagarConEfectivoUseCase } from './application/use-cases/pagar-con-efectivo.use-case';
import { ProcesarWebhookCulqiUseCase } from './application/use-cases/procesar-webhook-culqi.use-case';
import { ObtenerPagosPorCitaUseCase } from './application/use-cases/obtener-pagos-por-cita.use-case';
import { ObtenerPagoPorIdUseCase } from './application/use-cases/obtener-pago-por-id.use-case';
import { CitaModule } from '../cita/cita.module';
import { DetalleCitaModule } from '../detalle-cita/detalle-cita.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PagoCitaOrmEntity]),
    ConfigModule,
    CitaModule,
    DetalleCitaModule,
  ],
  controllers: [PagoCitaController, WebhookController],
  providers: [
    PagoCitaService,
    PagarConTarjetaUseCase,
    PagarConYapeUseCase,
    PagarConEfectivoUseCase,
    ProcesarWebhookCulqiUseCase,
    ObtenerPagosPorCitaUseCase,
    ObtenerPagoPorIdUseCase,
    {
      provide: PAGO_CITA_REPOSITORY_TOKEN,
      useClass: PagoCitaRepositoryImpl,
    },
  ],
  exports: [PAGO_CITA_REPOSITORY_TOKEN],
})
export class PagoCitaModule {}
