import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { BeneficioMembresia } from '../../domain/entities/beneficio-membresia.entity';
import { BeneficioMembresiaRepository } from '../../domain/repositories/beneficio-membresia.repository';
import { BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/beneficio-membresia.repository.token';

@Injectable()
export class ListarBeneficiosPorMembresiaUseCase {
  constructor(
    @Inject(BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN)
    private readonly beneficioRepository: BeneficioMembresiaRepository,
  ) {}

  async execute(idMembresia: string): Promise<Result<BeneficioMembresia[]>> {
    return await this.beneficioRepository.findByMembresiaId(idMembresia);
  }
}