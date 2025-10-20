import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ConsumoBeneficio } from '../../domain/entities/consumo-beneficio.entity';
import { ConsumoBeneficioRepository } from '../../domain/repositories/consumo-beneficio.repository';
import { CONSUMO_BENEFICIO_REPOSITORY_TOKEN } from '../../infrastructure/consumo-beneficio.repository.token';

@Injectable()
export class ListarConsumosPorSuscripcionUseCase {
  constructor(
    @Inject(CONSUMO_BENEFICIO_REPOSITORY_TOKEN)
    private readonly consumoRepository: ConsumoBeneficioRepository,
  ) {}

  async execute(idSuscripcion: string): Promise<Result<ConsumoBeneficio[]>> {
    return await this.consumoRepository.findBySuscripcionId(idSuscripcion);
  }
}