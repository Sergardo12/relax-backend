import { Inject, Injectable } from '@nestjs/common';
import { ColaboradorRepository } from '../../domain/repositories/colaborador.repository';
import { COLABORADOR_REPOSITORY } from '../../infrastructure/colaborador.repository.token';
import { Colaborador } from '../../domain/entities/colaborador.entity';
import { Result } from 'src/common/types/result';
import { ListarColaboradoresDto } from '../../infrastructure/dto/listar-colaboradores.dto';

@Injectable()
export class ListarColaboradoresUseCase {
  constructor(
    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepository: ColaboradorRepository,
  ) {}

  async ejecutar(query: ListarColaboradoresDto): Promise<Result<Colaborador[]>> {
    // Si hay filtro por especialidad, aplicarlo
    if (query.idEspecialidad) {
      return await this.colaboradorRepository.findByEspecialidadId(
        query.idEspecialidad,
      );
    }

    // Sin filtros, devolver todos los colaboradores
    return await this.colaboradorRepository.findAll();
  }
}
