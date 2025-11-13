import { Injectable } from '@nestjs/common';

import { ChatbotFunctionsService } from './chatbot-fuctions.service';
import { ChatGPTService } from './chatgpt.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly chatGPTService: ChatGPTService,
    private readonly functionsService: ChatbotFunctionsService,
  ) {}

  async responder(mensaje: string): Promise<string> {
  try {
    console.log('🤖 Pregunta:', mensaje);

    const todosLosResultados: string[] = [];
    const funcionesLlamadas: Set<string> = new Set(); // ⭐ Rastrear funciones ya llamadas
    let mensajeActual = mensaje;
    let intentosRestantes = 5;

    while (intentosRestantes > 0) {
      const response = await this.chatGPTService.chat(
        [
          {
            role: 'system',
            content: `Eres un asistente del spa Relax.

Tienes funciones disponibles para consultar la base de datos.
Si necesitas múltiples datos, llama UNA función diferente cada vez.
NO repitas funciones ya llamadas.
Cuando tengas toda la info necesaria, responde directamente al usuario sin llamar más funciones.`,
          },
          {
            role: 'user',
            content: mensajeActual,
          },
        ],
        this.functionsService.getToolDefinitions(),
      );

      // Si quiere llamar una función
      if (response.message.tool_calls && response.message.tool_calls.length > 0) {
        const toolCall = response.message.tool_calls[0];
        const functionName = (toolCall as any).function?.name;
        
        if (!functionName) break;

        // ⭐ Verificar si ya llamamos esta función
        if (funcionesLlamadas.has(functionName)) {
          console.log(`⚠️ Función ${functionName} ya fue llamada, deteniendo loop`);
          break;
        }
        
        console.log('🔧 Llamando función:', functionName);

        const functions = this.functionsService.getFunctions();
        
        if (!functions[functionName]) break;
        
        const resultado = await functions[functionName]();
        console.log('✅ Resultado:', resultado);

        todosLosResultados.push(resultado);
        funcionesLlamadas.add(functionName); // ⭐ Marcar como llamada
        
        // Actualizar el contexto
        mensajeActual = `Pregunta original: ${mensaje}\n\nDatos ya obtenidos:\n${todosLosResultados.join('\n')}\n\n¿Necesitas llamar otra función o ya tienes suficiente información para responder?`;
        intentosRestantes--;
      } else {
        // Ya no necesita más funciones
        if (todosLosResultados.length > 0) {
          // Formatear todos los resultados
          const finalResponse = await this.chatGPTService.chat([
            {
              role: 'system',
              content: `Eres un asistente amigable del spa Relax.

Presenta la siguiente información de forma clara, organizada y SIN repeticiones.
Usa emojis apropiadamente 😊`,
            },
            {
              role: 'user',
              content: mensaje,
            },
            {
              role: 'assistant',
              content: `Información obtenida de la base de datos:\n\n${todosLosResultados.join('\n')}`,
            },
          ]);

          return finalResponse.message.content || todosLosResultados.join('\n');
        }

        // Respuesta directa sin funciones
        return response.message.content || 'No pude procesar tu pregunta';
      }
    }

    // Si se agotaron los intentos
    if (todosLosResultados.length > 0) {
      // ⭐ Formatear sin repeticiones
      const resumenFinal = await this.chatGPTService.chat([
        {
          role: 'system',
          content: 'Eres un asistente amigable. Resume esta información de forma clara SIN repetir datos.',
        },
        {
          role: 'user',
          content: mensaje,
        },
        {
          role: 'assistant',
          content: `Datos:\n${todosLosResultados.join('\n')}`,
        },
      ]);

      return resumenFinal.message.content || todosLosResultados.join('\n\n');
    }

    return 'No pude obtener toda la información solicitada.';
  } catch (error) {
    console.error('❌ Error chatbot:', error.message);
    return 'Lo siento, ocurrió un error al procesar tu pregunta.';
  }
}
}
