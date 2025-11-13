import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';


@Injectable()
export class EliminarProveedorProductoUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.proveedorRepository.delete(id);

      if (!result.ok) {
        return Result.failure('Error al eliminar el proveedor');
      }

      return Result.success(true);
    } catch (error) {
      console.error('Error en EliminarProveedorUseCase:', error);
      return Result.failure('Error al eliminar el proveedor', error);
    }
  }
}