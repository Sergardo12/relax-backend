import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';


@Injectable()
export class ListarProveedoresProductoUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(): Promise<Result<ProveedorProducto[]>> {
    try {
      const result = await this.proveedorRepository.findAll();

      if (!result.ok) {
        return Result.failure('Error al listar proveedores');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarProveedoresUseCase:', error);
      return Result.failure('Error al listar proveedores', error);
    }
  }
}