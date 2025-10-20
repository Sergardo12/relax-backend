import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Membresia } from '../../domain/entities/membresia.entity';
import { MembresiaRepository } from '../../domain/repositories/membresia.repository';
import { MEMBRESIA_REPOSITORY_TOKEN } from '../../infrastructure/membresia.repository.token';
import { CrearMembresiaDto } from '../../infrastructure/dto/crear-membresia.dto';

@Injectable()
export class CrearMembresiaUseCase {
  constructor(
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
  ) {}

  async execute(dto: CrearMembresiaDto): Promise<Result<Membresia>> {
    try {
      // Validar que el precio sea positivo
      if (dto.precio <= 0) {
        return Result.failure('El precio debe ser mayor a 0');
      }

      // Validar que la duración sea al menos 1 día
      if (dto.duracionDias < 1) {
        return Result.failure('La duración debe ser de al menos 1 día');
      }

      // Crear la membresía
      const membresia = new Membresia({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: dto.precio,
        duracionDias: dto.duracionDias,
      });

      return await this.membresiaRepository.create(membresia);
    } catch (error) {
      console.error('Error en CrearMembresiaUseCase:', error);
      return Result.failure('Error al crear la membresía', error);
    }
  }
}