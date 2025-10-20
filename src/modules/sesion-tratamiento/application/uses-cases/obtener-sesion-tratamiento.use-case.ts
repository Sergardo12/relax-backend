import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/sesion-tratamiento.repository.token';

@Injectable()
export class ObtenerSesionTratamientoUseCase {
  constructor(
    @Inject(SESION_TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly sesionRepository: SesionTratamientoRepository,
  ) {}

  async execute(id: string): Promise<Result<SesionTratamiento>> {
    return await this.sesionRepository.findById(id);
  }
}