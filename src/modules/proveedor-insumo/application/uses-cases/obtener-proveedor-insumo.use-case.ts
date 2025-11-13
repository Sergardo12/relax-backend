import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../infrastructure/proveedor-insumo.repository.token';

@Injectable()
export class ObtenerProveedorInsumoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
  ) {}

  async execute(id: string): Promise<Result<ProveedorInsumo>> {
    try {
      const result = await this.proveedorRepository.findById(id);

      if (!result.ok) {
        return Result.failure('Error al buscar el proveedor');
      }

      if (!result.value) {
        return Result.failure('Proveedor no encontrado');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ObtenerProveedorInsumoUseCase:', error);
      return Result.failure('Error al obtener el proveedor', error);
    }
  }
}