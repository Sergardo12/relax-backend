import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EnviarRecordatorioCitaUseCase } from '../../application/uses-cases/enviar-recordatorio-cita.use-case';


@Injectable()
export class NotificacionScheduler {
  constructor(
    private readonly enviarRecordatorioUseCase: EnviarRecordatorioCitaUseCase,
  ) {}

  // ⭐ Cada 10 minutos
  @Cron('*/05 * * * *')
  async verificarCitasProximas() {
    console.log('⏰ [CRON] Verificando citas próximas...');
    try {
      await this.enviarRecordatorioUseCase.ejecutar();
      console.log('✅ [CRON] Verificación completada');
    } catch (error) {
      console.error('❌ [CRON] Error:', error);
    }
  }

  // ⭐ OPCIONAL: Cada hora (por si quieres otros recordatorios)
  // @Cron(CronExpression.EVERY_HOUR)
  // async otrasNotificaciones() {
  //   console.log('⏰ Enviando otras notificaciones...');
  // }
}