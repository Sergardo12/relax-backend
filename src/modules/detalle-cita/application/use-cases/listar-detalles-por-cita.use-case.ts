import { Inject, Injectable } from '@nestjs/common';
import { DetalleCitaRepository } from '../../domain/repositories/detalle-cita.repository';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../infrastructure/detalle-cita.repository.token';
import { DetalleCita } from '../../domain/entities/detalle-cita.entity';
import { Result } from 'src/common/types/result';

@Injectable()
export class ListarDetallesPorCitaUseCase {
  constructor(
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
  ) {}

  async ejecutar(idCita: string): Promise<Result<DetalleCita[]>> {
    return await this.detalleCitaRepository.findByCitaId(idCita);
  }
}
