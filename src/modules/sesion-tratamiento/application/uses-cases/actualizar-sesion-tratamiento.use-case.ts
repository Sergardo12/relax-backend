import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/sesion-tratamiento.repository.token';
import { ActualizarSesionTratamientoDto } from '../../infrastructure/dto/actualizar-sesion-tratamiento.dto';

@Injectable()
export class ActualizarSesionTratamientoUseCase {
  constructor(
    @Inject(SESION_TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly sesionRepository: SesionTratamientoRepository,
  ) {}

  async execute(id: string, dto: ActualizarSesionTratamientoDto): Promise<Result<SesionTratamiento>> {
    try {
      // 1. Buscar sesión existente
      const result = await this.sesionRepository.findById(id);
      if (!result.ok) {
        return Result.failure('Sesión no encontrada');
      }
      const sesion = result.value;

      // 2. Validar que no esté realizada (no se puede editar una sesión realizada)
      if (sesion.getEstado() === 'realizada') {
        return Result.failure('No se puede editar una sesión ya realizada');
      }

      // 3. Crear sesión actualizada
      const sesionActualizada = new SesionTratamiento({
        id: sesion.getId(),
        tratamiento: sesion.getTratamiento(),
        fecha: dto.fecha ? new Date(dto.fecha) : sesion.getFecha(),
        hora: dto.hora ?? sesion.getHora(),
        observaciones: dto.observaciones ?? sesion.getObservaciones(),
        estado: sesion.getEstado(),
      });

      // 4. Guardar cambios
      return await this.sesionRepository.update(id, sesionActualizada);
    } catch (error) {
      console.error('Error en ActualizarSesionTratamientoUseCase:', error);
      return Result.failure('Error al actualizar la sesión', error);
    }
  }
}