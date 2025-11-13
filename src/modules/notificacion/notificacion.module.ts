import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // ⭐ IMPORTAR
import { TwilioService } from './application/services/twilio.service';
import { CitaModule } from '../cita/cita.module';
import { EnviarRecordatorioCitaUseCase } from './application/uses-cases/enviar-recordatorio-cita.use-case';
import { NotificacionController } from './presentation/notificacion.controller';
import { NotificacionScheduler } from './infrastructure/schedulers/notificacion.scheduler';
import { ProcesarRespuestaWhatsAppUseCase } from './application/uses-cases/procesar-respuesta-whatsapp.use-case';


@Module({
  imports: [
    ScheduleModule.forRoot(), // ⭐ ACTIVAR CRON JOBS
    CitaModule, // Para acceder a CitaRepository
  ],
  controllers: [NotificacionController],
  providers: [
    TwilioService,
    EnviarRecordatorioCitaUseCase,
    ProcesarRespuestaWhatsAppUseCase,
    NotificacionScheduler, // ⭐ REGISTRAR EL SCHEDULER
  ],
  exports: [TwilioService],
})
export class NotificacionModule {}