import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.productoRepository.delete(id);
      
      if (!result.ok) {
        return Result.failure('Error al eliminar el producto');
      }

      return Result.success(true);
    } catch (error) {
      console.error('Error en EliminarProductoUseCase:', error);
      return Result.failure('Error al eliminar el producto', error);
    }
  }
}