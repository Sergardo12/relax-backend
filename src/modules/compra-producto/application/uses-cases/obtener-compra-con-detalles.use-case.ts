import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { CompraProductoRepository } from '../../domain/repositories/compra-producto.repository';
import { COMPRA_PRODUCTO_REPOSITORY } from '../../infrastructure/compra-producto.repository.token';
import { DetalleCompraProductoRepository } from '../../domain/repositories/detalle-compra-producto.repository';
import { DETALLE_COMPRA_PRODUCTO_REPOSITORY } from '../../infrastructure/detalle-compra-producto.repository.token';

@Injectable()
export class ObtenerCompraConDetallesUseCase {
  constructor(
    @Inject(COMPRA_PRODUCTO_REPOSITORY)
    private readonly compraRepository: CompraProductoRepository,
    @Inject(DETALLE_COMPRA_PRODUCTO_REPOSITORY)
    private readonly detalleRepository: DetalleCompraProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<any>> {
    try {
      // 1. Obtener compra
      const compraResult = await this.compraRepository.findById(id);

      if (!compraResult.ok) {
        return Result.failure('Error al buscar la compra');
      }

      if (!compraResult.value) {
        return Result.failure('Compra no encontrada');
      }

      const compra = compraResult.value;

      // 2. Obtener detalles
      const detallesResult = await this.detalleRepository.findByCompraId(id);

      if (!detallesResult.ok) {
        return Result.failure('Error al buscar los detalles');
      }

      // 3. Construir respuesta con detalles
      const respuesta = {
        ...compra.toJSON(),
        detalles: detallesResult.value.map(d => d.toJSON()),
      };

      return Result.success(respuesta);
    } catch (error) {
      console.error('Error en ObtenerCompraConDetallesUseCase:', error);
      return Result.failure('Error al obtener la compra', error);
    }
  }
}