import { Inject, Injectable } from '@nestjs/common';
import { ColaboradorRepository } from '../../domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../infrastructure/colaborador.repository.token';
import { Colaborador } from '../../domain/entities/colaborador.entity';
import { Result } from 'src/common/types/result';

@Injectable()
export class ObtenerColaboradorPorIdUseCase {
  constructor(
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<Colaborador>> {
    const result = await this.colaboradorRepository.findById(id);

    if (!result.ok) {
      return result;
    }

    if (!result.value) {
      return Result.failure('Colaborador no encontrado');
    }

    return result;
  }
}
