import { Injectable, Inject } from '@nestjs/common';
import { TwilioService } from '../services/twilio.service';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';

@Injectable()
export class EnviarRecordatorioCitaUseCase {
    private citasNotificadas = new Set<string>();
  constructor(
    private readonly twilioService: TwilioService,
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async ejecutar(): Promise<void> {
    // 1. Buscar citas en 1 hora
    const ahora = new Date();
    const enUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);
    

    const citasResult = await this.citaRepository.findAll();

    if (!citasResult.ok) return;

    const citasProximas = citasResult.value.filter((cita) => {
      if (cita.getEstado() !== 'pendiente') return false;

      const fechaCita = new Date(`${cita.getFecha()}T${cita.getHora()}`);
      const diff = fechaCita.getTime() - ahora.getTime();

      // Entre 50 y 70 minutos (margen de 10 min)
      // Esto para desarrollo
      return diff > 0 && diff < 120 * 60 * 1000;
      // esto para produccion
      // return diff > 50 * 60 * 1000 && diff < 70 * 60 * 1000;
    });

    console.log(`📱 ${citasProximas.length} citas requieren recordatorio`);

    // 2. Enviar recordatorios
    for (const cita of citasProximas) {
      const citaId = cita.getId();
      if (this.citasNotificadas.has(citaId)) {
      console.log(`⏭️ Recordatorio ya enviado para cita ${citaId}`);
      continue;
    }
      const paciente = cita.getPaciente();
      const telefono = paciente.getTelefono();
      const nombre = paciente.getNombres();
      const hora = cita.getHora();

      // ⭐ Mensaje mejorado
      const mensaje = `Hola ${nombre}! 👋

📅 *Recordatorio de Cita*
⏰ Hora: ${hora}
🏢 Lugar: Relax Spa

¿Confirmas tu asistencia?

Responde:
1️⃣ = *Sí, confirmo*
2️⃣ = *Cancelar cita*

¡Te esperamos! 😊✨`;

      const enviado = await this.twilioService.enviarWhatsApp(
        telefono,
        mensaje,
      );

      if (enviado) {
        console.log(`✅ Recordatorio enviado a ${nombre} (${telefono})`);
      } else {
        console.error(`❌ No se pudo enviar a ${nombre} (${telefono})`);
      }
    }
  }
}