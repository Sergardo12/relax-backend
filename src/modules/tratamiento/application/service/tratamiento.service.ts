import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/tratamiento.repository.token';

@Injectable()
export class TratamientoService {
  constructor(
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async validarTratamientoActivo(idPaciente: string): Promise<Result<boolean>> {
    try {
      const result = await this.tratamientoRepository.findByPacienteId(idPaciente);
      
      if (!result.ok) {
        return Result.failure(result.message);
      }

      const tratamientosActivos = result.value.filter(
        t => t.getEstado() === 'ACTIVO'
      );

      if (tratamientosActivos.length > 0) {
        return Result.success(true);
      }

      return Result.success(false);
    } catch (error) {
      return Result.failure('Error al validar tratamientos activos', error);
    }
  }

  async calcularProgreso(idTratamiento: string): Promise<Result<number>> {
    try {
      const result = await this.tratamientoRepository.findById(idTratamiento);
      
      if (!result.ok) {
        return Result.failure(result.message);
      }

      const tratamiento = result.value;
      const progreso = (tratamiento.getSesionesRealizadas() / tratamiento.getSesionesTotales()) * 100;

      return Result.success(Math.round(progreso));
    } catch (error) {
      return Result.failure('Error al calcular progreso', error);
    }
  }

  async verificarSesionesPendientes(idTratamiento: string): Promise<Result<number>> {
    try {
      const result = await this.tratamientoRepository.findById(idTratamiento);
      
      if (!result.ok) {
        return Result.failure(result.message);
      }

      const tratamiento = result.value;
      const pendientes = tratamiento.getSesionesTotales() - tratamiento.getSesionesRealizadas();

      return Result.success(pendientes);
    } catch (error) {
      return Result.failure('Error al verificar sesiones pendientes', error);
    }
  }
}