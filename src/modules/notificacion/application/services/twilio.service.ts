import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  private client: any; // ⭐ Tipo simplificado
  private whatsappNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const whatsappNumber = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');

    // ⭐ Validar que las variables existan
    if (!accountSid || !authToken || !whatsappNumber) {
      throw new Error('❌ Variables de Twilio no configuradas en .env');
    }

    this.whatsappNumber = whatsappNumber;
    
    // ⭐ USAR REQUIRE en lugar de import
    const twilio = require('twilio');
    this.client = twilio(accountSid, authToken);

    console.log('✅ Twilio inicializado');
  }

  async enviarWhatsApp(
    numeroDestino: string,
    mensaje: string,
  ): Promise<boolean> {
    try {
      const result = await this.client.messages.create({
        from: this.whatsappNumber,
        to: `whatsapp:+51${numeroDestino}`, // Perú
        body: mensaje,
      });

      console.log('✅ WhatsApp enviado:', result.sid);
      return true;
    } catch (error) {
      console.error('❌ Error enviando WhatsApp:', error);
      return false;
    }
  }
}