import { Inject, Injectable } from '@nestjs/common';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { Cita } from '../../domain/entities/cita.entity';
import { Result } from '../../../../common/types/result';

@Injectable()
export class ObtenerCitaPorIdUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<Cita | null>> {
    return await this.citaRepository.findById(id);
  }
}
