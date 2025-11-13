import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatbotService } from '../application/services/chatbot.service';
import { ChatbotMessageDto } from '../infrastructure/dto/chatbot-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/presentation/guards/roles.guard';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chatbot')

export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('administrador') // ⭐ Solo admins
  @Post('ask')
  async pregunta(@Body() dto: ChatbotMessageDto) {
    const respuesta = await this.chatbotService.responder(dto.mensaje);
    return { respuesta };
  }
}