import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { VentaProducto } from '../../domain/entities/venta-producto.entity';
import { VentaProductoRepository } from '../../domain/repositories/venta-producto.repository';
import { VentaProductoOrmEntity } from '../database/venta-producto.orm-entity';
import { VentaProductoMapper } from '../mapper/venta-producto.mapper';

@Injectable()
export class VentaProductoRepositoryImpl implements VentaProductoRepository {
  constructor(
    @InjectRepository(VentaProductoOrmEntity)
    private readonly ventaRepository: Repository<VentaProductoOrmEntity>,
  ) {}

  async create(venta: VentaProducto): Promise<Result<VentaProducto>> {
    try {
      const ventaOrm = VentaProductoMapper.toOrmEntity(venta);
      const saved = await this.ventaRepository.save(ventaOrm);

      const reloaded = await this.ventaRepository.findOne({
        where: { id: saved.id },
        relations: ['detalles', 'detalles.producto'],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar la venta creada');
      }

      return Result.success(VentaProductoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear la venta', error);
    }
  }

  async findAll(): Promise<Result<VentaProducto[]>> {
    try {
      const ventas = await this.ventaRepository.find({
        order: { createdAt: 'DESC' },
      });

      const ventasDomain = ventas.map(VentaProductoMapper.toDomain);
      return Result.success(ventasDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todas las ventas', error);
    }
  }

  async findById(id: string): Promise<Result<VentaProducto | null>> {
    try {
      const venta = await this.ventaRepository.findOne({
        where: { id },
        relations: ['detalles', 'detalles.producto'],
      });

      if (!venta) {
        return Result.success(null);
      }

      return Result.success(VentaProductoMapper.toDomain(venta));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar la venta', error);
    }
  }

  async findByFecha(fecha: Date): Promise<Result<VentaProducto[]>> {
    try {
      const ventas = await this.ventaRepository.find({
        where: { fecha },
        order: { createdAt: 'DESC' },
      });

      const ventasDomain = ventas.map(VentaProductoMapper.toDomain);
      return Result.success(ventasDomain);
    } catch (error) {
      console.error('Error en findByFecha:', error);
      return Result.failure('Error al buscar ventas por fecha', error);
    }
  }

  async findByMetodoPago(metodoPago: string): Promise<Result<VentaProducto[]>> {
    try {
      const ventas = await this.ventaRepository.find({
        where: { metodoPago: metodoPago as any },
        order: { createdAt: 'DESC' },
      });

      const ventasDomain = ventas.map(VentaProductoMapper.toDomain);
      return Result.success(ventasDomain);
    } catch (error) {
      console.error('Error en findByMetodoPago:', error);
      return Result.failure('Error al buscar ventas por método de pago', error);
    }
  }

  async update(id: string, venta: VentaProducto): Promise<Result<VentaProducto>> {
    try {
      const exists = await this.ventaRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Venta no encontrada');
      }

      const ventaOrm = VentaProductoMapper.toOrmEntity(venta);
      await this.ventaRepository.save(ventaOrm);

      const updated = await this.ventaRepository.findOne({
        where: { id },
        relations: ['detalles', 'detalles.producto'],
      });

      if (!updated) {
        return Result.failure('Error al recargar la venta actualizada');
      }

      return Result.success(VentaProductoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar la venta', error);
    }
  }
}