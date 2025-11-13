import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';

@Injectable()
export class ProductoService {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  
    //Valida que haya stock suficiente de un producto
   
  async validarStock(idProducto: string, cantidad: number): Promise<Result<boolean>> {
    try {
      const productoResult = await this.productoRepository.findById(idProducto);
      
      if (!productoResult.ok || !productoResult.value) {
        return Result.failure('Producto no encontrado');
      }

      const producto = productoResult.value;

      if (producto.getEstado() !== 'activo') {
        return Result.failure('El producto no está activo');
      }

      if (producto.getStock() < cantidad) {
        return Result.failure(
          `Stock insuficiente. Disponible: ${producto.getStock()}, Requerido: ${cantidad}`,
        );
      }

      return Result.success(true);
    } catch (error) {
      console.error('Error en validarStock:', error);
      return Result.failure('Error al validar stock', error);
    }
  }

  /**
   * Verifica productos vencidos o próximos a vencer
   */
  async verificarVencimientos(): Promise<Result<Producto[]>> {
    try {
      const vencidosResult = await this.productoRepository.findVencidos();
      
      if (!vencidosResult.ok) {
        return Result.failure('Error al buscar productos vencidos');
      }

      return Result.success(vencidosResult.value);
    } catch (error) {
      console.error('Error en verificarVencimientos:', error);
      return Result.failure('Error al verificar vencimientos', error);
    }
  }

  /**
   * Calcula el valor total del inventario
   */
  async calcularValorInventario(): Promise<Result<number>> {
    try {
      const productosResult = await this.productoRepository.findActivos();
      
      if (!productosResult.ok) {
        return Result.failure('Error al calcular valor de inventario');
      }

      const valorTotal = productosResult.value.reduce((total, producto) => {
        return total + (producto.getPrecioCosto() * producto.getStock());
      }, 0);

      return Result.success(valorTotal);
    } catch (error) {
      console.error('Error en calcularValorInventario:', error);
      return Result.failure('Error al calcular valor de inventario', error);
    }
  }
}