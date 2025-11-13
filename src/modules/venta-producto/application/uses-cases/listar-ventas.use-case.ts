import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { VentaProducto } from '../../domain/entities/venta-producto.entity';
import { VentaProductoRepository } from '../../domain/repositories/venta-producto.repository';
import { VENTA_PRODUCTO_REPOSITORY } from '../../infrastructure/venta-producto.repository.token';

@Injectable()
export class ListarVentasUseCase {
  constructor(
    @Inject(VENTA_PRODUCTO_REPOSITORY)
    private readonly ventaRepository: VentaProductoRepository,
  ) {}

  async execute(): Promise<Result<VentaProducto[]>> {
    try {
      const result = await this.ventaRepository.findAll();

      if (!result.ok) {
        return Result.failure('Error al listar ventas');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarVentasUseCase:', error);
      return Result.failure('Error al listar ventas', error);
    }
  }
}