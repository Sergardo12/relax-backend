import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { RegistroGasto } from '../../domain/entities/registro-gasto.entity';
import { RegistroGastoRepository } from '../../domain/repositories/registro-gasto.repository';
import { RegistroGastoOrmEntity } from '../database/registro-gasto.orm-entity';
import { RegistroGastoMapper } from '../mapper/registro-gasto.mapper';

@Injectable()
export class RegistroGastoRepositoryImpl implements RegistroGastoRepository {
  constructor(
    @InjectRepository(RegistroGastoOrmEntity)
    private readonly gastoRepository: Repository<RegistroGastoOrmEntity>,
  ) {}

  async create(gasto: RegistroGasto): Promise<Result<RegistroGasto>> {
    try {
      const gastoOrm = RegistroGastoMapper.toOrmEntity(gasto);
      const saved = await this.gastoRepository.save(gastoOrm);

      const reloaded = await this.gastoRepository.findOne({
        where: { id: saved.id },
        relations: ['proveedor', 'detalles'],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el gasto creado');
      }

      return Result.success(RegistroGastoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el gasto', error);
    }
  }

  async findAll(): Promise<Result<RegistroGasto[]>> {
    try {
      const gastos = await this.gastoRepository.find({
        relations: ['proveedor'],
        order: { createdAt: 'DESC' },
      });

      const gastosDomain = gastos.map(RegistroGastoMapper.toDomain);
      return Result.success(gastosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los gastos', error);
    }
  }

  async findById(id: string): Promise<Result<RegistroGasto | null>> {
    try {
      const gasto = await this.gastoRepository.findOne({
        where: { id },
        relations: ['proveedor', 'detalles'],
      });

      if (!gasto) {
        return Result.success(null);
      }

      return Result.success(RegistroGastoMapper.toDomain(gasto));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el gasto', error);
    }
  }

  async findByProveedor(idProveedor: string): Promise<Result<RegistroGasto[]>> {
    try {
      const gastos = await this.gastoRepository.find({
        where: { proveedor: { id: idProveedor } },
        relations: ['proveedor'],
        order: { fecha: 'DESC' },
      });

      const gastosDomain = gastos.map(RegistroGastoMapper.toDomain);
      return Result.success(gastosDomain);
    } catch (error) {
      console.error('Error en findByProveedor:', error);
      return Result.failure('Error al buscar gastos del proveedor', error);
    }
  }

  async findByFecha(fecha: Date): Promise<Result<RegistroGasto[]>> {
    try {
      const gastos = await this.gastoRepository.find({
        where: { fecha },
        relations: ['proveedor'],
        order: { createdAt: 'DESC' },
      });

      const gastosDomain = gastos.map(RegistroGastoMapper.toDomain);
      return Result.success(gastosDomain);
    } catch (error) {
      console.error('Error en findByFecha:', error);
      return Result.failure('Error al buscar gastos por fecha', error);
    }
  }

  async findByCategoria(categoria: string): Promise<Result<RegistroGasto[]>> {
    try {
      const gastos = await this.gastoRepository.find({
        where: { categoria: categoria as any },
        relations: ['proveedor'],
        order: { fecha: 'DESC' },
      });

      const gastosDomain = gastos.map(RegistroGastoMapper.toDomain);
      return Result.success(gastosDomain);
    } catch (error) {
      console.error('Error en findByCategoria:', error);
      return Result.failure('Error al buscar gastos por categoría', error);
    }
  }

  async update(id: string, gasto: RegistroGasto): Promise<Result<RegistroGasto>> {
    try {
      const exists = await this.gastoRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Gasto no encontrado');
      }

      const gastoOrm = RegistroGastoMapper.toOrmEntity(gasto);
      await this.gastoRepository.save(gastoOrm);

      const updated = await this.gastoRepository.findOne({
        where: { id },
        relations: ['proveedor', 'detalles'],
      });

      if (!updated) {
        return Result.failure('Error al recargar el gasto actualizado');
      }

      return Result.success(RegistroGastoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el gasto', error);
    }
  }
}