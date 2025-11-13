import { Module } from '@nestjs/common';
import { ChatbotController } from './presentation/chatbot.controller';
import { ChatbotService } from './application/services/chatbot.service';
import { ChatGPTService } from './application/services/chatgpt.service';
import { CitaModule } from '../cita/cita.module';
import { PacienteModule } from '../paciente/paciente.module';
import { ChatbotFunctionsService } from './application/services/chatbot-fuctions.service';
import { SuscripcionModule } from '../suscripcion/suscripcion.module';
import { MembresiaModule } from '../membresia/membresia.module';

@Module({
  imports: [CitaModule, PacienteModule, SuscripcionModule, MembresiaModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatGPTService, ChatbotFunctionsService],
})
export class ChatbotModule {}
