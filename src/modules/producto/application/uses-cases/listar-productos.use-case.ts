import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';

@Injectable()
export class ListarProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(): Promise<Result<Producto[]>> {
    try {
      const result = await this.productoRepository.findAll();
      
      if (!result.ok) {
        return Result.failure('Error al listar productos');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarProductosUseCase:', error);
      return Result.failure('Error al listar productos', error);
    }
  }
}