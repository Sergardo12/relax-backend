import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Membresia } from '../../domain/entities/membresia.entity';
import { MembresiaRepository } from '../../domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/membresia.repository.token';
import { ActualizarMembresiaDto } from '../../infrastructure/dto/actualizar-membresia.dto';

@Injectable()
export class ActualizarMembresiaUseCase {
  constructor(
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
  ) {}

  async execute(id: string, dto: ActualizarMembresiaDto): Promise<Result<Membresia>> {
    try {
      // Obtener la membresía existente
      const membresiaResult = await this.membresiaRepository.findById(id);
      if (!membresiaResult.ok) {
        return Result.failure('Membresía no encontrada');
      }

      const membresiaExistente = membresiaResult.value;

      // Validaciones
      if (dto.precio !== undefined && dto.precio <= 0) {
        return Result.failure('El precio debe ser mayor a 0');
      }

      if (dto.duracionDias !== undefined && dto.duracionDias < 1) {
        return Result.failure('La duración debe ser de al menos 1 día');
      }

      // Crear membresía actualizada
      const membresiaActualizada = new Membresia({
        id: membresiaExistente.getId(),
        nombre: dto.nombre ?? membresiaExistente.getNombre(),
        descripcion: dto.descripcion ?? membresiaExistente.getDescripcion(),
        precio: dto.precio ?? membresiaExistente.getPrecio(),
        duracionDias: dto.duracionDias ?? membresiaExistente.getDuracionDias(),
        estado: membresiaExistente.getEstado(),
      });

      return await this.membresiaRepository.update(id, membresiaActualizada);
    } catch (error) {
      console.error('Error en ActualizarMembresiaUseCase:', error);
      return Result.failure('Error al actualizar la membresía', error);
    }
  }
}