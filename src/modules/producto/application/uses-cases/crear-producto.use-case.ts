import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../infrastructure/producto.repository.token';
import { CrearProductoDto } from '../../infrastructure/dto/crear-producto.dto';


@Injectable()
export class CrearProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
  ) {}

  async execute(dto: CrearProductoDto): Promise<Result<Producto>> {
    try {
      // Validar que el precio de venta sea mayor o igual al costo
      if (dto.precioVenta < dto.precioCosto) {
        console.warn('⚠️ Advertencia: El precio de venta es menor al costo');
      }

      // Crear el producto
      const producto = new Producto({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precioCosto: dto.precioCosto,
        precioVenta: dto.precioVenta,
        stock: dto.stock,
        stockMinimo: dto.stockMinimo,
        categoria: dto.categoria,
        fechaVencimiento: dto.fechaVencimiento ? new Date(dto.fechaVencimiento) : undefined,
        lote: dto.lote,
      });

      const result = await this.productoRepository.create(producto);
      
      if (!result.ok) {
        return Result.failure('Error al crear el producto');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en CrearProductoUseCase:', error);
      return Result.failure('Error al crear el producto', error);
    }
  }
}