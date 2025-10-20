import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagoCitaRepository } from '../../domain/repositories/pago-cita.repository';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaOrmEntity } from '../database/pago-cita-entity.orm';
import { PagoCitaMapper } from '../mapper/pago-cita.mapper';
import { Result } from '../../../../common/types/result';

@Injectable()
export class PagoCitaRepositoryImpl implements PagoCitaRepository {
  constructor(
    @InjectRepository(PagoCitaOrmEntity)
    private readonly pagoCitaRepository: Repository<PagoCitaOrmEntity>,
  ) {}

  async create(pagoCita: PagoCita): Promise<Result<PagoCita>> {
    try {
      const ormEntity = PagoCitaMapper.toOrmEntity(pagoCita);
      const savedEntity = await this.pagoCitaRepository.save(ormEntity);
      const reloadedEntity = await this.pagoCitaRepository.findOne({
        where: { id: savedEntity.id },
        relations:['cita', 'cita.paciente', 'cita.paciente.usuario', 'cita.paciente.usuario.rol']
      });
      return Result.success(PagoCitaMapper.toDomain(reloadedEntity!));
    } catch (error) {
      console.error('Error en create pago:', error)
      return Result.failure('Error al crear el pago de cita', error);
    }
  }

  async findAll(): Promise<Result<PagoCita[]>> {
    try {
      const ormEntities = await this.pagoCitaRepository.find();
      const pagosCita = ormEntities.map(PagoCitaMapper.toDomain);
      return Result.success(pagosCita);
    } catch (error) {
      return Result.failure('Error al obtener los pagos de cita', error);
    }
  }

  async findById(id: string): Promise<Result<PagoCita | null>> {
    try {
      const ormEntity = await this.pagoCitaRepository.findOne({ where: { id } });
      if (!ormEntity) {
        return Result.success(null);
      }
      return Result.success(PagoCitaMapper.toDomain(ormEntity));
    } catch (error) {
      return Result.failure(`Error al buscar el pago de cita por ID ${id}`, error);
    }
  }

  async findByCitaId(citaId: string): Promise<Result<PagoCita[]>> {
    try {
      const ormEntities = await this.pagoCitaRepository.find({
        where: { cita: { id: citaId } },
      });
      const pagosCita = ormEntities.map(PagoCitaMapper.toDomain);
      return Result.success(pagosCita);
    } catch (error) {
      return Result.failure(
        `Error al buscar pagos de la cita ${citaId}`,
        error,
      );
    }
  }

  async findByCulqiChargeId(culqiChargeId: string): Promise<Result<PagoCita | null>> {
    try {
      const ormEntity = await this.pagoCitaRepository.findOne({
        where: { culqiChargeId },
      });
      if (!ormEntity) {
        return Result.success(null);
      }
      return Result.success(PagoCitaMapper.toDomain(ormEntity));
    } catch (error) {
      return Result.failure(
        `Error al buscar el pago por culqiChargeId ${culqiChargeId}`,
        error,
      );
    }
  }

  async update(pagoCita: PagoCita): Promise<Result<PagoCita>> {
    try {
      const existe = await this.pagoCitaRepository.findOne({
        where: { id: pagoCita.getId() },
      });
      if (!existe) {
        return Result.failure(`No se encontró pago de cita con ID ${pagoCita.getId()}`);
      }

      const ormEntity = PagoCitaMapper.toOrmEntity(pagoCita);
      const savedEntity = await this.pagoCitaRepository.save(ormEntity);
      const reloadedEntity = await this.pagoCitaRepository.findOne({
        where: { id: savedEntity.id },
        relations: ['cita', 'cita.paciente', 'cita.paciente.usuario', 'cita.paciente.usuario.rol']
      });
      return Result.success(PagoCitaMapper.toDomain(reloadedEntity!));
    } catch (error) {
      return Result.failure(
        `Error al actualizar pago de cita con ID ${pagoCita.getId()}`,
        error,
      );
    }
  }
}
