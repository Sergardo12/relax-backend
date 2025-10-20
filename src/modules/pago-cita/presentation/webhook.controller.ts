import { Controller, Post, Body } from '@nestjs/common';
import { ProcesarWebhookCulqiUseCase } from '../application/use-cases/procesar-webhook-culqi.use-case';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly procesarWebhookCulqiUseCase: ProcesarWebhookCulqiUseCase,
  ) {}

  @Post('culqi')
  async procesarWebhookCulqi(@Body() payload: any) {
    const result = await this.procesarWebhookCulqiUseCase.execute(payload);

    // Los webhooks deben retornar 200 OK independientemente del resultado
    return {
      success: result.ok,
      message: result.ok ? 'Webhook procesado correctamente' : result.message,
    };
  }
}
