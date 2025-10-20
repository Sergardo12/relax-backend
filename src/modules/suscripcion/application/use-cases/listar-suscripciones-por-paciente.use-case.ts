import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Suscripcion } from '../../domain/entities/suscripcion.entity';
import { SuscripcionRepository } from '../../domain/repositories/suscripcion.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/suscripcion.repository.token';

@Injectable()
export class ListarSuscripcionesPorPacienteUseCase {
  constructor(
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
  ) {}

  async execute(idPaciente: string): Promise<Result<Suscripcion[]>> {
    return await this.suscripcionRepository.findByPacienteId(idPaciente);
  }
}