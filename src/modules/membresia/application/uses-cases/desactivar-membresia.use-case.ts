import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Membresia } from '../../domain/entities/membresia.entity';
import { MembresiaRepository } from '../../domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/membresia.repository.token';

@Injectable()
export class DesactivarMembresiaUseCase {
  constructor(
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
  ) {}

  async execute(id: string): Promise<Result<Membresia>> {
    return await this.membresiaRepository.delete(id);
  }
}