import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';
import { AjustarStockProductoDto } from '../../infrastructure/dto/ajustar-stock-producto.use-case';
import { OperacionStock } from '../../domain/enums/producto.enum';

@Injectable()
export class AjustarStockProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(id: string, dto: AjustarStockProductoDto): Promise<Result<Producto>> {
    try {
      // Buscar el producto
      const productoResult = await this.productoRepository.findById(id);
      
      if (!productoResult.ok || !productoResult.value) {
        return Result.failure('Producto no encontrado');
      }

      const producto = productoResult.value;

      // ⭐ Ajustar stock según la operación
      if (dto.operacion === OperacionStock.AUMENTAR) {
        producto.aumentarStock(dto.cantidad);
        console.log(`📦 Stock aumentado: +${dto.cantidad} (${dto.tipo})`);
      } else if (dto.operacion === OperacionStock.DISMINUIR) {
        producto.disminuirStock(dto.cantidad);
        console.log(`📦 Stock disminuido: -${dto.cantidad} (${dto.tipo})`);
      }

      if (dto.motivo) {
        console.log(`📝 Motivo: ${dto.motivo}`);
      }

      // Guardar el producto actualizado
      const result = await this.productoRepository.update(id, producto);
      
      if (!result.ok) {
        return Result.failure('Error al ajustar el stock');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en AjustarStockProductoUseCase:', error);
      return Result.failure(error.message || 'Error al ajustar el stock', error);
    }
  }
}