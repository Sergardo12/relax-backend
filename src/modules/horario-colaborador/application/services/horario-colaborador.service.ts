import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from '../../infrastructure/horario-colaborador.repository.token';
import { DiaSemana } from '../../domain/enums/dia-semana.enum';

@Injectable()
export class HorarioColaboradorService {
  constructor(
    @Inject(HORARIO_COLABORADOR_REPOSITORY_TOKEN)
    private readonly horarioColaboradorRepository: HorarioColaboradorRepository,
  ) {}

  /**
   * Valida que la hora tenga el formato HH:mm
   */
  validarFormatoHora(hora: string): Result<boolean> {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regex.test(hora)) {
      return Result.failure(
        `Formato de hora inválido: ${hora}. Debe ser HH:mm`,
      );
    }
    return Result.success(true);
  }

  /**
   * Valida que el horario esté dentro del horario laboral (08:00 - 22:30)
   */
  validarHorarioLaboral(horaInicio: string, horaFin: string): Result<boolean> {
    const [horaInicioHH, horaInicioMM] = horaInicio.split(':').map(Number);
    const [horaFinHH, horaFinMM] = horaFin.split(':').map(Number);

    const minutosInicio = horaInicioHH * 60 + horaInicioMM;
    const minutosFin = horaFinHH * 60 + horaFinMM;

    const horaLaboralInicio = 8 * 60; // 08:00 = 480 minutos
    const horaLaboralFin = 22 * 60 + 30; // 22:30 = 1350 minutos

    if (minutosInicio < horaLaboralInicio || minutosInicio > horaLaboralFin) {
      return Result.failure(
        `La hora de inicio ${horaInicio} está fuera del horario laboral (08:00 - 22:30)`,
      );
    }

    if (minutosFin < horaLaboralInicio || minutosFin > horaLaboralFin) {
      return Result.failure(
        `La hora de fin ${horaFin} está fuera del horario laboral (08:00 - 22:30)`,
      );
    }

    return Result.success(true);
  }

  /**
   * Valida que la hora de fin sea mayor que la hora de inicio
   */
  validarHoraFinMayorQueInicio(
    horaInicio: string,
    horaFin: string,
  ): Result<boolean> {
    const [horaInicioHH, horaInicioMM] = horaInicio.split(':').map(Number);
    const [horaFinHH, horaFinMM] = horaFin.split(':').map(Number);

    const minutosInicio = horaInicioHH * 60 + horaInicioMM;
    const minutosFin = horaFinHH * 60 + horaFinMM;

    if (minutosFin <= minutosInicio) {
      return Result.failure(
        `La hora de fin (${horaFin}) debe ser mayor que la hora de inicio (${horaInicio})`,
      );
    }

    return Result.success(true);
  }

  /**
   * Valida que no haya solapamiento de horarios para el mismo colaborador en el mismo día
   * @param idColaborador ID del colaborador
   * @param diaSemana Día de la semana
   * @param horaInicio Hora de inicio del horario
   * @param horaFin Hora de fin del horario
   * @param idHorarioActual ID del horario actual (opcional, para excluirlo en updates)
   */
  async validarSolapamiento(
    idColaborador: string,
    diaSemana: DiaSemana,
    horaInicio: string,
    horaFin: string,
    idHorarioActual?: string,
  ): Promise<Result<boolean>> {
    // Obtener todos los horarios del colaborador en ese día
    const result = await this.horarioColaboradorRepository.findByColaboradorAndDia(
      idColaborador,
      diaSemana,
    );

    if (!result.ok) {
      return Result.failure(result.message);
    }

    const horariosExistentes = result.value;

    // Convertir las horas a minutos para facilitar la comparación
    const [horaInicioHH, horaInicioMM] = horaInicio.split(':').map(Number);
    const [horaFinHH, horaFinMM] = horaFin.split(':').map(Number);
    const minutosInicio = horaInicioHH * 60 + horaInicioMM;
    const minutosFin = horaFinHH * 60 + horaFinMM;

    // Verificar solapamiento con cada horario existente
    for (const horario of horariosExistentes) {
      // Si estamos actualizando, excluir el horario actual
      if (idHorarioActual && horario.getId() === idHorarioActual) {
        continue;
      }

      const [existenteInicioHH, existenteInicioMM] = horario
        .getHoraInicio()
        .split(':')
        .map(Number);
      const [existenteFinHH, existenteFinMM] = horario
        .getHoraFin()
        .split(':')
        .map(Number);
      const existenteMinutosInicio = existenteInicioHH * 60 + existenteInicioMM;
      const existenteMinutosFin = existenteFinHH * 60 + existenteFinMM;

      // Verificar solapamiento:
      // Hay solapamiento si el nuevo horario comienza antes de que termine el existente
      // Y el nuevo horario termina después de que comience el existente
      const haySolapamiento =
        minutosInicio < existenteMinutosFin &&
        minutosFin > existenteMinutosInicio;

      if (haySolapamiento) {
        return Result.failure(
          `El horario se solapa con un horario existente: ${diaSemana} ${horario.getHoraInicio()}-${horario.getHoraFin()}`,
        );
      }
    }

    return Result.success(true);
  }
}
