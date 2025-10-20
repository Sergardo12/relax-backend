import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { BeneficioMembresiaRepository } from '../../domain/repositories/beneficio-membresia.repository';
import { BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/beneficio-membresia.repository.token';

@Injectable()
export class EliminarBeneficioMembresiaUseCase {
  constructor(
    @Inject(BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN)
    private readonly beneficioRepository: BeneficioMembresiaRepository,
  ) {}

  async execute(id: string): Promise<Result<void>> {
    return await this.beneficioRepository.delete(id);
  }
}