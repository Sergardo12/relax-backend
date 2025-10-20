import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Suscripcion } from '../../domain/entities/suscripcion.entity';
import { SuscripcionRepository } from '../../domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/suscripcion.repository.token';

@Injectable()
export class SuscripcionService {
  constructor(
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
  ) {}

  /**
   * Valida si el paciente tiene una suscripción activa para un servicio específico
   */
  async validarSuscripcionActivaParaServicio(
    idPaciente: string,
    idServicio: string,
  ): Promise<Result<Suscripcion>> {
    try {
      // Obtener suscripciones activas del paciente
      const suscripcionesResult = await this.suscripcionRepository.findActivasByPacienteId(
        idPaciente,
      );

      if (!suscripcionesResult.ok) {
        return Result.failure('Error al buscar suscripciones del paciente');
      }

      const suscripciones = suscripcionesResult.value;

      // Buscar una suscripción que incluya el servicio
      // NOTA: Esto requeriría cargar los beneficios de cada suscripción
      // Por ahora, solo validamos que tenga al menos una suscripción activa
      if (suscripciones.length === 0) {
        return Result.failure('El paciente no tiene suscripciones activas');
      }

      // Filtrar suscripciones vigentes
      const hoy = new Date();
      const suscripcionesVigentes = suscripciones.filter(s => s.estaActiva());

      if (suscripcionesVigentes.length === 0) {
        return Result.failure('El paciente no tiene suscripciones vigentes');
      }

      // Retornar la primera suscripción vigente
      return Result.success(suscripcionesVigentes[0]);
    } catch (error) {
      console.error('Error en validarSuscripcionActivaParaServicio:', error);
      return Result.failure('Error al validar suscripción', error);
    }
  }

  /**
   * Verifica si una suscripción debe vencer
   */
  async verificarVencimientos(): Promise<Result<number>> {
    try {
      const suscripcionesResult = await this.suscripcionRepository.findAll();
      if (!suscripcionesResult.ok) {
        return Result.failure('Error al buscar suscripciones');
      }

      let vencidas = 0;
      const hoy = new Date();

      for (const suscripcion of suscripcionesResult.value) {
        // Solo procesar activas
        if (suscripcion.getEstado() !== 'activa') {
          continue;
        }

        const fechaFin = suscripcion.getFechaFin();
        if (fechaFin && hoy > fechaFin) {
          // Vencer la suscripción
          suscripcion.vencer();
          await this.suscripcionRepository.update(suscripcion.getId(), suscripcion);
          vencidas++;
        }
      }

      return Result.success(vencidas);
    } catch (error) {
      console.error('Error en verificarVencimientos:', error);
      return Result.failure('Error al verificar vencimientos', error);
    }
  }
}