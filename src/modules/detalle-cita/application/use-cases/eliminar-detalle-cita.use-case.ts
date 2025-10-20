import { Inject, Injectable } from '@nestjs/common';
import { DetalleCitaRepository } from '../../domain/repositories/detalle-cita.repository';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../infrastructure/detalle-cita.repository.token';
import { Result } from 'src/common/types/result';

@Injectable()
export class EliminarDetalleCitaUseCase {
  constructor(
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
  ) {}

  async ejecutar(id: string): Promise<Result<void>> {
    return await this.detalleCitaRepository.delete(id);
  }
}
