import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { PAGO_CITA_REPOSITORY_TOKEN } from '../../infrastructure/pago-cita.repository.token';

@Injectable()
export class ObtenerPagosPorCitaUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY_TOKEN)
    private readonly pagoCitaRepository: PagoCitaRepository,
  ) {}

  async execute(idCita: string): Promise<Result<PagoCita[]>> {
    return await this.pagoCitaRepository.findByCitaId(idCita);
  }
}
