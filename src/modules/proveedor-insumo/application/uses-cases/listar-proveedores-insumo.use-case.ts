import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../infrastructure/proveedor-insumo.repository.token';

@Injectable()
export class ListarProveedoresInsumoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
  ) {}

  async execute(): Promise<Result<ProveedorInsumo[]>> {
    try {
      const result = await this.proveedorRepository.findAll();

      if (!result.ok) {
        return Result.failure('Error al listar proveedores');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarProveedoresInsumoUseCase:', error);
      return Result.failure('Error al listar proveedores', error);
    }
  }
}