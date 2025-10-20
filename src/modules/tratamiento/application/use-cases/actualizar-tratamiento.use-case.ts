import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/tratamiento.repository.token';
import { ActualizarTratamientoDto } from '../../infrastructure/dto/actualizar-tratamiento.dto';

@Injectable()
export class ActualizarTratamientoUseCase {
  constructor(
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async execute(id: string, dto: ActualizarTratamientoDto): Promise<Result<Tratamiento>> {
    try {
      // 1. Buscar tratamiento existente
      const result = await this.tratamientoRepository.findById(id);
      if (!result.ok) {
        return Result.failure('Tratamiento no encontrado');
      }

      const tratamiento = result.value;

      // 2. Crear nuevo tratamiento con campos actualizados
      const tratamientoActualizado = new Tratamiento({
        id: tratamiento.getId(),
        cita: tratamiento.getCita(),
        colaborador: tratamiento.getColaborador(),
        paciente: tratamiento.getPaciente(),
        fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : tratamiento.getFechaInicio(),
        diagnostico: dto.diagnostico ?? tratamiento.getDiagnostico(),
        tratamiento: dto.tratamiento ?? tratamiento.getTratamiento(),
        presionArterial: dto.presionArterial ?? tratamiento.getPresionArterial(),
        pulso: dto.pulso ?? tratamiento.getPulso(),
        temperatura: dto.temperatura ?? tratamiento.getTemperatura(),
        peso: dto.peso ?? tratamiento.getPeso(),
        saturacion: dto.saturacion ?? tratamiento.getSaturacion(),
        sesionesTotales: dto.sesionesTotales ?? tratamiento.getSesionesTotales(),
        sesionesRealizadas: tratamiento.getSesionesRealizadas(),
        fechaFin: tratamiento.getFechaFin(),
        precioTotal: dto.precioTotal ?? tratamiento.getPrecioTotal(),
        estado: tratamiento.getEstado(),
      });

      // 3. Guardar cambios
      return await this.tratamientoRepository.update(id, tratamientoActualizado);
    } catch (error) {
      console.error('Error en ActualizarTratamientoUseCase:', error);
      return Result.failure('Error al actualizar el tratamiento', error);
    }
  }
}