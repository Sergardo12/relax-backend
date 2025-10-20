import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Membresia } from '../../domain/entities/membresia.entity';
import { MembresiaRepository } from '../../domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/membresia.repository.token';

@Injectable()
export class ListarMembresiasActivasUseCase {
  constructor(
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
  ) {}

  async execute(): Promise<Result<Membresia[]>> {
    return await this.membresiaRepository.findActivas();
  }
}