import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { Membresia } from '../../domain/entities/membresia.entity';
import { MembresiaRepository } from '../../domain/repositories/membresia.repository';
import { MembresiaOrmEntity } from '../database/membresia.orm-entity';
import { MembresiaMapper } from '../mapper/membresia.mapper';
import { EstadoMembresia } from '../../domain/enum/membresia.enum';

@Injectable()
export class MembresiaRepositoryImpl implements MembresiaRepository {
  constructor(
    @InjectRepository(MembresiaOrmEntity)
    private readonly membresiaRepository: Repository<MembresiaOrmEntity>,
  ) {}

  async create(membresia: Membresia): Promise<Result<Membresia>> {
    try {
      const membresiaOrm = MembresiaMapper.toOrmEntity(membresia);
      const saved = await this.membresiaRepository.save(membresiaOrm);
      
      const reloaded = await this.membresiaRepository.findOne({
        where: { id: saved.id },
      });

      if (!reloaded) {
        return Result.failure('Error al recargar la membresía creada');
      }

      return Result.success(MembresiaMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear la membresía', error);
    }
  }

  async findAll(): Promise<Result<Membresia[]>> {
    try {
      const membresias = await this.membresiaRepository.find({
        order: { nombre: 'ASC' },
      });

      const membresiasDomain = membresias.map(MembresiaMapper.toDomain);
      return Result.success(membresiasDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todas las membresías', error);
    }
  }

  async findById(id: string): Promise<Result<Membresia>> {
    try {
      const membresia = await this.membresiaRepository.findOne({
        where: { id },
      });

      if (!membresia) {
        return Result.failure('Membresía no encontrada');
      }

      return Result.success(MembresiaMapper.toDomain(membresia));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar la membresía', error);
    }
  }

  async findActivas(): Promise<Result<Membresia[]>> {
    try {
      const membresias = await this.membresiaRepository.find({
        where: { estado: EstadoMembresia.ACTIVA },
        order: { nombre: 'ASC' },
      });

      const membresiasDomain = membresias.map(MembresiaMapper.toDomain);
      return Result.success(membresiasDomain);
    } catch (error) {
      console.error('Error en findActivas:', error);
      return Result.failure('Error al buscar membresías activas', error);
    }
  }

  async update(id: string, membresia: Membresia): Promise<Result<Membresia>> {
    try {
      const exists = await this.membresiaRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Membresía no encontrada');
      }

      const membresiaOrm = MembresiaMapper.toOrmEntity(membresia);
      await this.membresiaRepository.save(membresiaOrm);

      const updated = await this.membresiaRepository.findOne({
        where: { id },
      });

      if (!updated) {
        return Result.failure('Error al recargar la membresía actualizada');
      }

      return Result.success(MembresiaMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar la membresía', error);
    }
  }

  async delete(id: string): Promise<Result<Membresia>> {
    try {
      const membresia = await this.membresiaRepository.findOne({
        where: { id },
      });

      if (!membresia) {
        return Result.failure('Membresía no encontrada');
      }

      // Borrado lógico: cambiar estado a INACTIVA
      membresia.estado = EstadoMembresia.INACTIVA;
      await this.membresiaRepository.save(membresia);

      const updated = await this.membresiaRepository.findOne({
        where: { id },
      });

      if (!updated) {
        return Result.failure('Error al recargar la membresía desactivada');
      }

      return Result.success(MembresiaMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al desactivar la membresía', error);
    }
  }
}