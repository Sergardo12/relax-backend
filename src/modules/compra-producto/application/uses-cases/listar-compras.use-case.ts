import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { CompraProducto } from '../../domain/entities/compra-producto.entity';
import { CompraProductoRepository } from '../../domain/repositories/compra-producto.repository';
import { COMPRA_PRODUCTO_REPOSITORY } from '../../infrastructure/compra-producto.repository.token';

@Injectable()
export class ListarComprasUseCase {
  constructor(
    @Inject(COMPRA_PRODUCTO_REPOSITORY)
    private readonly compraRepository: CompraProductoRepository,
  ) {}

  async execute(): Promise<Result<CompraProducto[]>> {
    try {
      const result = await this.compraRepository.findAll();

      if (!result.ok) {
        return Result.failure('Error al listar compras');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarComprasUseCase:', error);
      return Result.failure('Error al listar compras', error);
    }
  }
}