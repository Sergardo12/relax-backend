import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { HorarioColaborador } from '../../domain/entities/horario-colaborador.entity';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HORARIO_COLABORADOR_REPOSITORY_TOKEN } from '../../infrastructure/horario-colaborador.repository.token';

@Injectable()
export class ListarHorariosPorColaboradorUseCase {
  constructor(
    @Inject(HORARIO_COLABORADOR_REPOSITORY_TOKEN)
    private readonly horarioColaboradorRepository: HorarioColaboradorRepository,
  ) {}

  async ejecutar(
    idColaborador: string,
  ): Promise<Result<HorarioColaborador[]>> {
    return await this.horarioColaboradorRepository.findByColaboradorId(
      idColaborador,
    );
  }
}
