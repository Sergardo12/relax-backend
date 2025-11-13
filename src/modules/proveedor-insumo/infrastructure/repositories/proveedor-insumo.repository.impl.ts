import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { ProveedorInsumoOrmEntity } from '../database/proveedor-insumo.orm-entity';
import { ProveedorInsumoMapper } from '../mapper/proveedor-insumo.mapper';
import { EstadoProveedorInsumo } from '../../domain/enums/proveedor-insumo.enum';

@Injectable()
export class ProveedorInsumoRepositoryImpl implements ProveedorInsumoRepository {
  constructor(
    @InjectRepository(ProveedorInsumoOrmEntity)
    private readonly proveedorRepository: Repository<ProveedorInsumoOrmEntity>,
  ) {}

  async create(proveedor: ProveedorInsumo): Promise<Result<ProveedorInsumo>> {
    try {
      const proveedorOrm = ProveedorInsumoMapper.toOrmEntity(proveedor);
      const saved = await this.proveedorRepository.save(proveedorOrm);

      const reloaded = await this.proveedorRepository.findOne({
        where: { id: saved.id },
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el proveedor creado');
      }

      return Result.success(ProveedorInsumoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el proveedor', error);
    }
  }

  async findAll(): Promise<Result<ProveedorInsumo[]>> {
    try {
      const proveedores = await this.proveedorRepository.find({
        order: { createdAt: 'DESC' },
      });

      const proveedoresDomain = proveedores.map(ProveedorInsumoMapper.toDomain);
      return Result.success(proveedoresDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los proveedores', error);
    }
  }

  async findById(id: string): Promise<Result<ProveedorInsumo | null>> {
    try {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id },
      });

      if (!proveedor) {
        return Result.success(null);
      }

      return Result.success(ProveedorInsumoMapper.toDomain(proveedor));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el proveedor', error);
    }
  }

  async findActivos(): Promise<Result<ProveedorInsumo[]>> {
    try {
      const proveedores = await this.proveedorRepository.find({
        where: { estado: EstadoProveedorInsumo.ACTIVO },
        order: { nombre: 'ASC' },
      });

      const proveedoresDomain = proveedores.map(ProveedorInsumoMapper.toDomain);
      return Result.success(proveedoresDomain);
    } catch (error) {
      console.error('Error en findActivos:', error);
      return Result.failure('Error al buscar proveedores activos', error);
    }
  }

  async update(id: string, proveedor: ProveedorInsumo): Promise<Result<ProveedorInsumo>> {
    try {
      const exists = await this.proveedorRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Proveedor no encontrado');
      }

      const proveedorOrm = ProveedorInsumoMapper.toOrmEntity(proveedor);
      await this.proveedorRepository.save(proveedorOrm);

      const updated = await this.proveedorRepository.findOne({
        where: { id },
      });

      if (!updated) {
        return Result.failure('Error al recargar el proveedor actualizado');
      }

      return Result.success(ProveedorInsumoMapper.toDomain(updated));
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

      // Borrado lógico
      proveedor.estado = EstadoProveedorInsumo.INACTIVO;
      await this.proveedorRepository.save(proveedor);

      return Result.success(true);
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al eliminar el proveedor', error);
    }
  }
}