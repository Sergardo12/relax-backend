import { Inject, Injectable } from '@nestjs/common';
import { DetalleCitaRepository } from '../../domain/repositories/detalle-cita.repository';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../infrastructure/detalle-cita.repository.token';
import { DetalleCita } from '../../domain/entities/detalle-cita.entity';
import { Result } from 'src/common/types/result';
import { ActualizarObservacionesDto } from '../../infrastructure/dto/actualizar-observaciones.dto';

@Injectable()
export class ActualizarObservacionesUseCase {
  constructor(
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
  ) {}

  async ejecutar(
    id: string,
    dto: ActualizarObservacionesDto,
  ): Promise<Result<DetalleCita>> {
    const { observaciones, diagnostico, recomendaciones } = dto;
    // Obtener el detalle existente
    const detalleResult = await this.detalleCitaRepository.findById(id);
    if (!detalleResult.ok) {
      return Result.failure(detalleResult.message);
    }

    // Actualizar las observaciones usando el método de negocio
    const detalle = detalleResult.value;
    detalle.actualizarObservaciones(observaciones, diagnostico, recomendaciones);

    // Guardar los cambios
    return await this.detalleCitaRepository.update(detalle);
  }
}
