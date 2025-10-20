import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/tratamiento.repository.token';

@Injectable()
export class ObtenerTratamientoUseCase {
  constructor(
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async execute(id: string): Promise<Result<Tratamiento>> {
    return await this.tratamientoRepository.findById(id);
  }
}