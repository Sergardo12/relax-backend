import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { DetalleCompraProducto } from '../../domain/entities/detalle-compra-producto.entity';
import { DetalleCompraProductoRepository } from '../../domain/repositories/detalle-compra-producto.repository';
import { DetalleCompraProductoOrmEntity } from '../database/detalle-compra-producto.orm-entity';
import { DetalleCompraProductoMapper } from '../mapper/detalle-compra-producto.mapper';

@Injectable()
export class DetalleCompraProductoRepositoryImpl
  implements DetalleCompraProductoRepository
{
  constructor(
    @InjectRepository(DetalleCompraProductoOrmEntity)
    private readonly detalleRepository: Repository<DetalleCompraProductoOrmEntity>,
  ) {}

  async create(detalle: DetalleCompraProducto): Promise<Result<DetalleCompraProducto>> {
    try {
      // Nota: Necesitamos el idCompra para crear el detalle
      // Este método probablemente no se use directamente
      // Se usará desde el use case de crear compra
      return Result.failure('Use crear-compra-producto.use-case para crear detalles');
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el detalle', error);
    }
  }

  async findByCompraId(idCompra: string): Promise<Result<DetalleCompraProducto[]>> {
    try {
      const detalles = await this.detalleRepository.find({
        where: { compra: { id: idCompra } },
        relations: ['producto'],
      });

      const detallesDomain = detalles.map(DetalleCompraProductoMapper.toDomain);
      return Result.success(detallesDomain);
    } catch (error) {
      console.error('Error en findByCompraId:', error);
      return Result.failure('Error al buscar detalles de la compra', error);
    }
  }
}