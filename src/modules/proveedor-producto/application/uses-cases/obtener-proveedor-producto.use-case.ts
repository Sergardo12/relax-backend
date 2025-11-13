import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';


@Injectable()
export class ObtenerProveedorProductoUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<ProveedorProducto>> {
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
      console.error('Error en ObtenerProveedorUseCase:', error);
      return Result.failure('Error al obtener el proveedor', error);
    }
  }
}