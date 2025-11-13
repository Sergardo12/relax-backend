import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../infrastructure/proveedor-insumo.repository.token';

@Injectable()
export class EliminarProveedorInsumoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
  ) {}

  async execute(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.proveedorRepository.delete(id);

      if (!result.ok) {
        return Result.failure('Error al eliminar el proveedor');
      }

      return Result.success(true);
    } catch (error) {
      console.error('Error en EliminarProveedorInsumoUseCase:', error);
      return Result.failure('Error al eliminar el proveedor', error);
    }
  }
}