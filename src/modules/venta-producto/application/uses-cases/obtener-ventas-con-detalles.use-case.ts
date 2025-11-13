import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { VentaProductoRepository } from '../../domain/repositories/venta-producto.repository';
import { VENTA_PRODUCTO_REPOSITORY } from '../../infrastructure/venta-producto.repository.token';
import { DetalleVentaProductoRepository } from '../../domain/repositories/detalle-venta-producto.repository';
import { DETALLE_VENTA_PRODUCTO_REPOSITORY } from '../../infrastructure/detalle-venta-producto.repository.token';

@Injectable()
export class ObtenerVentaConDetallesUseCase {
  constructor(
    @Inject(VENTA_PRODUCTO_REPOSITORY)
    private readonly ventaRepository: VentaProductoRepository,
    @Inject(DETALLE_VENTA_PRODUCTO_REPOSITORY)
    private readonly detalleRepository: DetalleVentaProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<any>> {
    try {
      // 1. Obtener venta
      const ventaResult = await this.ventaRepository.findById(id);

      if (!ventaResult.ok) {
        return Result.failure('Error al buscar la venta');
      }

      if (!ventaResult.value) {
        return Result.failure('Venta no encontrada');
      }

      const venta = ventaResult.value;

      // 2. Obtener detalles
      const detallesResult = await this.detalleRepository.findByVentaId(id);

      if (!detallesResult.ok) {
        return Result.failure('Error al buscar los detalles');
      }

      // 3. Construir respuesta con detalles
      const respuesta = {
        ...venta.toJSON(),
        detalles: detallesResult.value.map(d => d.toJSON()),
      };

      return Result.success(respuesta);
    } catch (error) {
      console.error('Error en ObtenerVentaConDetallesUseCase:', error);
      return Result.failure('Error al obtener la venta', error);
    }
  }
}