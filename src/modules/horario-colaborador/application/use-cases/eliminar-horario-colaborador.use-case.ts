import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from '../../infrastructure/horario-colaborador.repository.token';

@Injectable()
export class EliminarHorarioColaboradorUseCase {
  constructor(
    @Inject(HORARIO_COLABORADOR_REPOSITORY_TOKEN)
    private readonly horarioColaboradorRepository: HorarioColaboradorRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<void>> {
    // Validar que el horario existe
    const horarioResult = await this.horarioColaboradorRepository.findById(id);
    if (!horarioResult.ok) {
      return Result.failure(`Horario con ID ${id} no encontrado`);
    }

    // Eliminado físico
    return await this.horarioColaboradorRepository.delete(id);
  }
}
