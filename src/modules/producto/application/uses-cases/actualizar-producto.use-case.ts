import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';
import { ActualizarProductoDto } from '../../infrastructure/dto/actualizar-producto.dto';

@Injectable()
export class ActualizarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(id: string, dto: ActualizarProductoDto): Promise<Result<Producto>> {
    try {
      // Buscar el producto existente
      const productoResult = await this.productoRepository.findById(id);
      
      if (!productoResult.ok || !productoResult.value) {
        return Result.failure('Producto no encontrado');
      }

      const producto = productoResult.value;

      // Actualizar solo los campos proporcionados
      if (dto.nombre !== undefined) {
        // No hay setter, pero se puede crear uno en la entity si es necesario
        // O reconstruir el producto con los nuevos valores
      }

      // Reconstruir el producto con los valores actualizados
      const productoActualizado = new Producto({
        id: producto.getId(),
        nombre: dto.nombre ?? producto.getNombre(),
        descripcion: dto.descripcion ?? producto.getDescripcion(),
        precioCosto: dto.precioCosto ?? producto.getPrecioCosto(),
        precioVenta: dto.precioVenta ?? producto.getPrecioVenta(),
        stock: producto.getStock(), // Stock no se modifica aquí
        stockMinimo: dto.stockMinimo ?? producto.getStockMinimo(),
        categoria: dto.categoria ?? producto.getCategoria(),
        estado: dto.estado ?? producto.getEstado(),
        fechaVencimiento: dto.fechaVencimiento 
          ? new Date(dto.fechaVencimiento) 
          : producto.getFechaVencimiento(),
        lote: dto.lote ?? producto.getLote(),
        creadoEn: producto.getCreadoEn(),
        actualizadoEn: new Date(),
      });

      const result = await this.productoRepository.update(id, productoActualizado);
      
      if (!result.ok) {
        return Result.failure('Error al actualizar el producto');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ActualizarProductoUseCase:', error);
      return Result.failure('Error al actualizar el producto', error);
    }
  }
}