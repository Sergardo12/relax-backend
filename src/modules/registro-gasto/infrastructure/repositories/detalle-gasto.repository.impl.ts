import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { DetalleGasto } from '../../domain/entities/detalle-gasto.entity';
import { DetalleGastoRepository } from '../../domain/repositories/detalle-gasto.repository';
import { DetalleGastoOrmEntity } from '../database/detalle-gasto.orm-entity';
import { DetalleGastoMapper } from '../mapper/detalle-gasto.mapper';

@Injectable()
export class DetalleGastoRepositoryImpl implements DetalleGastoRepository {
  constructor(
    @InjectRepository(DetalleGastoOrmEntity)
    private readonly detalleRepository: Repository<DetalleGastoOrmEntity>,
  ) {}

  async create(detalle: DetalleGasto): Promise<Result<DetalleGasto>> {
    try {
      return Result.failure('Use crear-registro-gasto.use-case para crear detalles');
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el detalle', error);
    }
  }

  async findByGastoId(idGasto: string): Promise<Result<DetalleGasto[]>> {
    try {
      const detalles = await this.detalleRepository.find({
        where: { gasto: { id: idGasto } },
      });

      const detallesDomain = detalles.map(DetalleGastoMapper.toDomain);
      return Result.success(detallesDomain);
    } catch (error) {
      console.error('Error en findByGastoId:', error);
      return Result.failure('Error al buscar detalles del gasto', error);
    }
  }
}