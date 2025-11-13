import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { CompraProducto } from '../../domain/entities/compra-producto.entity';
import { CompraProductoRepository } from '../../domain/repositories/compra-producto.repository';
import { CompraProductoOrmEntity } from '../database/compra-producto.orm-entity';
import { CompraProductoMapper } from '../mapper/compra-producto.mapper';

@Injectable()
export class CompraProductoRepositoryImpl implements CompraProductoRepository {
  constructor(
    @InjectRepository(CompraProductoOrmEntity)
    private readonly compraRepository: Repository<CompraProductoOrmEntity>,
  ) {}

  async create(compra: CompraProducto): Promise<Result<CompraProducto>> {
    try {
      const compraOrm = CompraProductoMapper.toOrmEntity(compra);
      const saved = await this.compraRepository.save(compraOrm);

      const reloaded = await this.compraRepository.findOne({
        where: { id: saved.id },
        relations: ['proveedor', 'detalles', 'detalles.producto'],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar la compra creada');
      }

      return Result.success(CompraProductoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear la compra', error);
    }
  }

  async findAll(): Promise<Result<CompraProducto[]>> {
    try {
      const compras = await this.compraRepository.find({
        relations: ['proveedor'],
        order: { createdAt: 'DESC' },
      });

      const comprasDomain = compras.map(CompraProductoMapper.toDomain);
      return Result.success(comprasDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todas las compras', error);
    }
  }

  async findById(id: string): Promise<Result<CompraProducto | null>> {
    try {
      const compra = await this.compraRepository.findOne({
        where: { id },
        relations: ['proveedor', 'detalles', 'detalles.producto'],
      });

      if (!compra) {
        return Result.success(null);
      }

      return Result.success(CompraProductoMapper.toDomain(compra));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar la compra', error);
    }
  }

  async findByProveedor(idProveedor: string): Promise<Result<CompraProducto[]>> {
    try {
      const compras = await this.compraRepository.find({
        where: { proveedor: { id: idProveedor } },
        relations: ['proveedor'],
        order: { fecha: 'DESC' },
      });

      const comprasDomain = compras.map(CompraProductoMapper.toDomain);
      return Result.success(comprasDomain);
    } catch (error) {
      console.error('Error en findByProveedor:', error);
      return Result.failure('Error al buscar compras del proveedor', error);
    }
  }

  async findByFecha(fecha: Date): Promise<Result<CompraProducto[]>> {
    try {
      const compras = await this.compraRepository.find({
        where: { fecha },
        relations: ['proveedor'],
        order: { createdAt: 'DESC' },
      });

      const comprasDomain = compras.map(CompraProductoMapper.toDomain);
      return Result.success(comprasDomain);
    } catch (error) {
      console.error('Error en findByFecha:', error);
      return Result.failure('Error al buscar compras por fecha', error);
    }
  }

  async update(id: string, compra: CompraProducto): Promise<Result<CompraProducto>> {
    try {
      const exists = await this.compraRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Compra no encontrada');
      }

      const compraOrm = CompraProductoMapper.toOrmEntity(compra);
      await this.compraRepository.save(compraOrm);

      const updated = await this.compraRepository.findOne({
        where: { id },
        relations: ['proveedor', 'detalles', 'detalles.producto'],
      });

      if (!updated) {
        return Result.failure('Error al recargar la compra actualizada');
      }

      return Result.success(CompraProductoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar la compra', error);
    }
  }
}