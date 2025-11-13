import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatGPTService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    // ⭐ USA TU API KEY DE OPENAI
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('❌ OPENAI_API_KEY no configurada en .env');
    }

    // ⭐ OPENAI DIRECTO (sin OpenRouter)
    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('✅ OpenAI inicializado correctamente');
  }

  async chat(messages: Array<{ role: string; content: string }>, tools?: any[]) {
    try {
      console.log('📤 Enviando a OpenAI...');
      console.log('📝 Mensaje:', messages[messages.length - 1].content);

      const requestParams: any = {
        model: 'gpt-4o-mini', // ⭐ MODELO RECOMENDADO
        messages: messages,
        temperature: 0.7,
      };

      if (tools && tools.length > 0) {
        requestParams.tools = tools;
        requestParams.tool_choice = 'auto';
        console.log('🔧 Tools disponibles:', tools.length);
      }

      const response = await this.openai.chat.completions.create(requestParams);

      console.log('✅ Respuesta recibida de OpenAI');
      return response.choices[0];
    } catch (error) {
      console.error('❌ Error OpenAI:', error.message);
      console.error('❌ Status:', error.status);
      throw error;
    }
  }
}