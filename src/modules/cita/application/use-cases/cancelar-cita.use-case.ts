import { Inject, Injectable } from '@nestjs/common';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { Cita } from '../../domain/entities/cita.entity';
import { Result } from '../../../../common/types/result';

@Injectable()
export class CancelarCitaUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<Cita>> {
    // Obtener la cita
    const citaResult = await this.citaRepository.findById(id);
    if (!citaResult.ok) {
      return Result.failure('Error al buscar la cita');
    }
    if (!citaResult.value) {
      return Result.failure('La cita no existe');
    }

    const cita = citaResult.value;

    // Usar el método de dominio para cancelar
    try {
      cita.cancelar();
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Error al cancelar la cita',
      );
    }

    // Actualizar en el repositorio
    return await this.citaRepository.update(id, cita);
  }
}
