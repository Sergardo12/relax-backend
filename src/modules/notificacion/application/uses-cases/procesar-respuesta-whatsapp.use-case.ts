import { Injectable, Inject } from '@nestjs/common';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';

@Injectable()
export class ProcesarRespuestaWhatsAppUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async ejecutar(body: any): Promise<string> {
    const mensaje = body.Body?.trim();
    const from = body.From?.replace('whatsapp:+51', '');

    console.log(`📱 Procesando: "${mensaje}" de ${from}`);

    // VALIDAR MENSAJE
    if (!mensaje || (mensaje !== '1' && mensaje !== '2')) {
      return this.generarRespuestaXML(
        'Por favor responde:\n1️⃣ = Confirmar\n2️⃣ = Cancelar'
      );
    }

    // BUSCAR CITA
    const citasResult = await this.citaRepository.findAll();
    if (!citasResult.ok) {
      return this.generarRespuestaXML('Error al procesar. Contacta al spa.');
    }

    const hoy = new Date();
    const hoyStr = this.formatearFecha(hoy);

    const citasPendientes = citasResult.value.filter((cita) => {
      const fechaCitaStr = this.formatearFecha(cita.getFecha());
      return (
        cita.getEstado() === 'pendiente' &&
        cita.getPaciente().getTelefono() === from &&
        fechaCitaStr === hoyStr
      );
    });

    if (citasPendientes.length === 0) {
      return this.generarRespuestaXML(
        'No encontramos citas pendientes para hoy. 😊'
      );
    }

    // PROCESAR RESPUESTA
    let respuesta = '';
    
    if (mensaje === '1') {
      for (const cita of citasPendientes) {
        cita.confirmar();
        await this.citaRepository.update(cita.getId(), cita);
        console.log('✅ Cita CONFIRMADA:', cita.getId());
      }
      
      respuesta = citasPendientes.length === 1
        ? '✅ ¡Perfecto! Tu cita ha sido confirmada. Te esperamos. 😊'
        : `✅ ¡Perfecto! Tus ${citasPendientes.length} citas han sido confirmadas. Te esperamos. 😊`;
        
    } else {
      for (const cita of citasPendientes) {
        cita.cancelar();
        await this.citaRepository.update(cita.getId(), cita);
        console.log('❌ Cita CANCELADA:', cita.getId());
      }
      
      respuesta = citasPendientes.length === 1
        ? '❌ Tu cita ha sido cancelada. Puedes reagendar cuando gustes.'
        : `❌ Tus ${citasPendientes.length} citas han sido canceladas. Puedes reagendar cuando gustes.`;
    }

    return this.generarRespuestaXML(respuesta); // ✅ return al final
  }

  private formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return fecha.split('T')[0];
    }
    
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generarRespuestaXML(mensaje: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${mensaje}</Message>
</Response>`;
  }
}