import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SESION_TRATAMIENTO_REPOSITORY_TOKEN } from '../../infrastructure/sesion-tratamiento.repository.token';
import { CrearSesionTratamientoDto } from '../../infrastructure/dto/crear-sesion-tratamiento.dto';
import { TratamientoRepository } from '../../../tratamiento/domain/repositories/tratamiento.repository';
import { TRATAMIENTO_REPOSITORY_TOKEN } from '../../../tratamiento/infrastructure/tratamiento.repository.token';

@Injectable()
export class CrearSesionTratamientoUseCase {
  constructor(
    @Inject(SESION_TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly sesionRepository: SesionTratamientoRepository,
    @Inject(TRATAMIENTO_REPOSITORY_TOKEN)
    private readonly tratamientoRepository: TratamientoRepository,
  ) {}

  async execute(dto: CrearSesionTratamientoDto): Promise<Result<SesionTratamiento>> {
    try {
      console.log('🔍 DTO recibido:', dto); // ← DEBUG
      console.log('🔍 ID Tratamiento:', dto.idTratamiento); // ← DEBUG
      // 1. Validar que el tratamiento exista
      const tratamientoResult = await this.tratamientoRepository.findById(dto.idTratamiento);
      
       console.log('🔍 Resultado buscar tratamiento:', tratamientoResult.ok); // ← DEBUG
      if (!tratamientoResult.ok) {
        return Result.failure('Tratamiento no encontrado');
      }
      const tratamiento = tratamientoResult.value;

      // 2. Validar que el tratamiento esté activo
      if (tratamiento.getEstado() !== 'ACTIVO') {
        return Result.failure('El tratamiento no está activo');
      }

      // 3. Contar sesiones existentes (no canceladas)
    const sesionesResult = await this.sesionRepository.findByTratamientoId(dto.idTratamiento);
    if (!sesionesResult.ok) {
      return Result.failure('Error al validar sesiones existentes');
    }

    const sesionesActivas = sesionesResult.value.filter(
      s => s.getEstado() !== 'cancelada'
    );

    // 4. Validar que no exceda el límite
    if (sesionesActivas.length >= tratamiento.getSesionesTotales()) {
      return Result.failure(
        `El tratamiento ya tiene ${tratamiento.getSesionesTotales()} sesiones programadas. No se pueden agregar más.`
      );
    }
    const fechaSesion = new Date(dto.fecha + 'T12:00:00')

      // 4. Crear la sesión
      const sesion = new SesionTratamiento({
        tratamiento,
        fecha:fechaSesion ,
        hora: dto.hora,
        observaciones: dto.observaciones,
      });

      // 5. Guardar en BD
      return await this.sesionRepository.create(sesion);
    } catch (error) {
      console.error('Error en CrearSesionTratamientoUseCase:', error);
      return Result.failure('Error al crear la sesión', error);
    }
  }
}