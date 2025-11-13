import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { DetalleVentaProducto } from '../../domain/entities/detalle-venta-producto.entity';
import { DetalleVentaProductoRepository } from '../../domain/repositories/detalle-venta-producto.repository';
import { DetalleVentaProductoOrmEntity } from '../database/detalle-venta-producto.orm-entity';
import { DetalleVentaProductoMapper } from '../mapper/detalle-venta-producto.mapper';

@Injectable()
export class DetalleVentaProductoRepositoryImpl
  implements DetalleVentaProductoRepository
{
  constructor(
    @InjectRepository(DetalleVentaProductoOrmEntity)
    private readonly detalleRepository: Repository<DetalleVentaProductoOrmEntity>,
  ) {}

  async create(detalle: DetalleVentaProducto): Promise<Result<DetalleVentaProducto>> {
    try {
      return Result.failure('Use crear-venta-producto.use-case para crear detalles');
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el detalle', error);
    }
  }

  async findByVentaId(idVenta: string): Promise<Result<DetalleVentaProducto[]>> {
    try {
      const detalles = await this.detalleRepository.find({
        where: { venta: { id: idVenta } },
        relations: ['producto'],
      });

      const detallesDomain = detalles.map(DetalleVentaProductoMapper.toDomain);
      return Result.success(detallesDomain);
    } catch (error) {
      console.error('Error en findByVentaId:', error);
      return Result.failure('Error al buscar detalles de la venta', error);
    }
  }
}