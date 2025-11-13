import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { ProveedorProductoOrmEntity } from '../database/proveedor-producto.orm-entity';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';
import { ProveedorProductoMapper } from '../mapper/proveedor-producto.mapper';
import { EstadoProveedorProducto } from '../../domain/enum/proveedor-producto.enum';


@Injectable()
export class ProveedorProductoRepositoryImpl implements ProveedorProductoRepository {
  constructor(
    @InjectRepository(ProveedorProductoOrmEntity)
    private readonly proveedorRepository: Repository<ProveedorProductoOrmEntity>,
  ) {}

  async create(proveedor: ProveedorProducto): Promise<Result<ProveedorProducto>> {
    try {
      const proveedorOrm = ProveedorProductoMapper.toOrmEntity(proveedor);
      const saved = await this.proveedorRepository.save(proveedorOrm);

      const reloaded = await this.proveedorRepository.findOne({
        where: { id: saved.id },
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el proveedor creado');
      }

      return Result.success(ProveedorProductoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el proveedor', error);
    }
  }

  async findAll(): Promise<Result<ProveedorProducto[]>> {
    try {
      const proveedores = await this.proveedorRepository.find({
        order: { createdAt: 'DESC' },
      });

      const proveedoresDomain = proveedores.map(ProveedorProductoMapper.toDomain);
      return Result.success(proveedoresDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los proveedores', error);
    }
  }

  async findById(id: string): Promise<Result<ProveedorProducto | null>> {
    try {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id },
      });

      if (!proveedor) {
        return Result.success(null);
      }

      return Result.success(ProveedorProductoMapper.toDomain(proveedor));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el proveedor', error);
    }
  }

  async findActivos(): Promise<Result<ProveedorProducto[]>> {
    try {
      const proveedores = await this.proveedorRepository.find({
        where: { estado: EstadoProveedorProducto.ACTIVO },
        order: { nombre: 'ASC' },
      });

      const proveedoresDomain = proveedores.map(ProveedorProductoMapper.toDomain);
      return Result.success(proveedoresDomain);
    } catch (error) {
      console.error('Error en findActivos:', error);
      return Result.failure('Error al buscar proveedores activos', error);
    }
  }

  async update(id: string, proveedor: ProveedorProducto): Promise<Result<ProveedorProducto>> {
    try {
      const exists = await this.proveedorRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Proveedor no encontrado');
      }

      const proveedorOrm = ProveedorProductoMapper.toOrmEntity(proveedor);
      await this.proveedorRepository.save(proveedorOrm);

      const updated = await this.proveedorRepository.findOne({
        where: { id },
      });

      if (!updated) {
        return Result.failure('Error al recargar el proveedor actualizado');
      }

      return Result.success(ProveedorProductoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el proveedor', error);
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id },
      });

      if (!proveedor) {
        return Result.failure('Proveedor no encontrado');
      }

      // ⭐ Borrado lógico: cambiar estado a INACTIVO
      proveedor.estado = EstadoProveedorProducto.INACTIVO;
      await this.proveedorRepository.save(proveedor);

      return Result.success(true);
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al eliminar el proveedor', error);
    }
  }
}