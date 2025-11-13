import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';


@Injectable()
export class ListarProveedoresProductoActivosUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(): Promise<Result<ProveedorProducto[]>> {
    try {
      const result = await this.proveedorRepository.findActivos();

      if (!result.ok) {
        return Result.failure('Error al listar proveedores activos');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarProveedoresActivosUseCase:', error);
      return Result.failure('Error al listar proveedores activos', error);
    }
  }
}