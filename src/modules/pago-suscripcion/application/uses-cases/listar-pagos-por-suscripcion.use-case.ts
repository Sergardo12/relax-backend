import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionRepository } from '../../domain/repositories/pago-suscripcion.repository';
import { PAGO_SUSCRIPCION_REPOSITORY_TOKEN } from '../../infrastructure/pago-suscripcion.repository.token';

@Injectable()
export class ListarPagosPorSuscripcionUseCase {
  constructor(
    @Inject(PAGO_SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly pagoRepository: PagoSuscripcionRepository,
  ) {}

  async execute(idSuscripcion: string): Promise<Result<PagoSuscripcion[]>> {
    return await this.pagoRepository.findBySuscripcionId(idSuscripcion);
  }
}