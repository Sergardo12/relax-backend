import { Injectable } from '@nestjs/common';

@Injectable()
export class CitaService {
  /**
   * Valida que la fecha de la cita sea futura
   */
  validarFechaFutura(fecha: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha >= hoy;
  }

  /**
   * Valida que la hora esté dentro del horario laboral (8:00 AM - 8:00 PM)
   */
  validarHorarioLaboral(hora: string): boolean {
    const [hours, minutes] = hora.split(':').map(Number);
    const horaEnMinutos = hours * 60 + minutes;
    const inicioLaboral = 8 * 60; // 8:00 AM
    const finLaboral = 20 * 60; // 8:00 PM

    return horaEnMinutos >= inicioLaboral && horaEnMinutos <= finLaboral;
  }

  /**
   * Combina fecha y hora para validaciones
   */
  combinarFechaHora(fecha: Date, hora: string): Date {
    const [hours, minutes] = hora.split(':').map(Number);
    const fechaHora = new Date(fecha);
    fechaHora.setHours(hours, minutes, 0, 0);
    return fechaHora;
  }
}
