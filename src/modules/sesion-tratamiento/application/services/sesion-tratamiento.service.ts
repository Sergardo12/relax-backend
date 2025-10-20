import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/sesion-tratamiento.repository.token';

@Injectable()
export class SesionTratamientoService {
  constructor(
    @Inject(SESION_TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly sesionRepository: SesionTratamientoRepository,
  ) {}

  async contarSesionesPorEstado(idTratamiento: string, estado: string): Promise<Result<number>> {
    try {
      const result = await this.sesionRepository.findByTratamientoId(idTratamiento);
      
      if (!result.ok) {
        return Result.failure(result.message);
      }

      const count = result.value.filter(s => s.getEstado() === estado).length;
      return Result.success(count);
    } catch (error) {
      return Result.failure('Error al contar sesiones por estado', error);
    }
  }

  async verificarDisponibilidadHoraria(
    fecha: Date,
    hora: string,
    idColaborador: string
  ): Promise<Result<boolean>> {
    try {
      // Aquí podrías agregar lógica para verificar que no haya conflictos
      // con otras sesiones del colaborador
      // Por ahora retornamos true
      return Result.success(true);
    } catch (error) {
      return Result.failure('Error al verificar disponibilidad', error);
    }
  }
}