import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/tratamiento.repository.token';

@Injectable()
export class CancelarTratamientoUseCase {
  constructor(
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async execute(id: string): Promise<Result<Tratamiento>> {
    // El repository ya maneja el borrado lógico
    return await this.tratamientoRepository.delete(id);
  }
}