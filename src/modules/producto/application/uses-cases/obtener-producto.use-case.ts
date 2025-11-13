import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';

@Injectable()
export class ObtenerProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<Producto>> {
    try {
      const result = await this.productoRepository.findById(id);
      
      if (!result.ok) {
        return Result.failure('Error al buscar el producto');
      }

      if (!result.value) {
        return Result.failure('Producto no encontrado');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ObtenerProductoUseCase:', error);
      return Result.failure('Error al obtener el producto', error);
    }
  }
}