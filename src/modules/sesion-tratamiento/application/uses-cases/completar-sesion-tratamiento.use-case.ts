import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/sesion-tratamiento.repository.token';
import { TratamientoRepository } from '../../../tratamiento/domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../../tratamiento/infrastructure/tratamiento.repository.token';
import { CompletarSesionDto } from '../../infrastructure/dto/completar-sesion-tratamiento.dto';


@Injectable()
export class CompletarSesionTratamientoUseCase {
  constructor(
    @Inject(SESION_TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly sesionRepository: SesionTratamientoRepository,
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async execute(id: string, dto: CompletarSesionDto): Promise<Result<SesionTratamiento>> {
    try {
      // 1. Buscar la sesión
      const sesionResult = await this.sesionRepository.findById(id);
      if (!sesionResult.ok) {
        return Result.failure('Sesión no encontrada');
      }
      const sesion = sesionResult.value;

      // 2. Validar que no esté ya realizada
      if (sesion.getEstado() === 'realizada') {
        return Result.failure('La sesión ya fue completada');
      }

      // 3. Marcar como realizada (esto incrementa el contador en el tratamiento)
      sesion.marcarComoRealizada(dto.observaciones);

      // 4. Guardar sesión actualizada
      const updateSesionResult = await this.sesionRepository.update(id, sesion);
      if (!updateSesionResult.ok) {
        return Result.failure('Error al actualizar la sesión');
      }

      // 5. Actualizar el tratamiento (incrementar sesionesRealizadas)
      const tratamiento = sesion.getTratamiento();
      console.log('📊 Sesiones realizadas:', tratamiento.getSesionesRealizadas());
      console.log('📊 Sesiones totales:', tratamiento.getSesionesTotales());
      console.log('📊 Estado tratamiento:', tratamiento.getEstado());
      console.log('📊 Fecha fin:', tratamiento.getFechaFin());
      
      const updateTratamientoResult = await this.tratamientoRepository.update(
        tratamiento.getId(),
        tratamiento,
      );

      if (!updateTratamientoResult.ok) {
        return Result.failure('Error al actualizar el tratamiento');
      }

      return Result.success(updateSesionResult.value);
    } catch (error) {
      console.error('Error en CompletarSesionTratamientoUseCase:', error);
      return Result.failure('Error al completar la sesión', error);
    }
  }
}