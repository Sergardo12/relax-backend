import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TwilioService } from '../application/services/twilio.service';
import { EnviarRecordatorioCitaUseCase } from '../application/uses-cases/enviar-recordatorio-cita.use-case';
import { ProcesarRespuestaWhatsAppUseCase } from '../application/uses-cases/procesar-respuesta-whatsapp.use-case';

@Controller('notificaciones')
export class NotificacionController {
  constructor(
    private readonly enviarRecordatorioUseCase: EnviarRecordatorioCitaUseCase,
    private readonly twilioService: TwilioService,
    private readonly procesarRespuestaUseCase: ProcesarRespuestaWhatsAppUseCase,
  ) {}

  // ⭐ TEST 1: Enviar mensaje directo
  @Post('test/enviar/:numero')
  async testEnviar(
    @Param('numero') numero: string,
    @Body() body: { mensaje: string },
  ) {
    const resultado = await this.twilioService.enviarWhatsApp(
      numero,
      body.mensaje,
    );
    return { enviado: resultado };
  }

  // ⭐ TEST 2: Ejecutar recordatorios manualmente
  @Get('test/recordatorios')
  async testRecordatorios() {
    await this.enviarRecordatorioUseCase.ejecutar();
    return { message: 'Recordatorios procesados' };
  }

  // ⭐ Webhook para recibir respuestas de WhatsApp (futuro)
  @Post('webhook/whatsapp')
  async procesarRespuesta(@Body() body: any) {
    console.log('📱 Webhook recibido');

    try {
      const respuestaXML = await this.procesarRespuestaUseCase.ejecutar(body);
      return respuestaXML; // ⭐ El use case devuelve el XML
    } catch (error) {
      console.error('❌ Error en webhook:', error);
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Lo siento, ocurrió un error. Contacta al spa.</Message>
</Response>`;
    }
  }
}