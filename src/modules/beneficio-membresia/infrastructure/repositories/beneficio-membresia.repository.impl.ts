import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { BeneficioMembresia } from '../../domain/entities/beneficio-membresia.entity';
import { BeneficioMembresiaRepository } from '../../domain/repositories/beneficio-membresia.repository';
import { BeneficioMembresiaMapper } from '../mapper/beneficio-membresia.mapper';
import { BeneficioMembresiaOrmEntity } from '../database/beneficio.membresia.orm-entity';

@Injectable()
export class BeneficioMembresiaRepositoryImpl implements BeneficioMembresiaRepository {
  constructor(
    @InjectRepository(BeneficioMembresiaOrmEntity)
    private readonly beneficioRepository: Repository<BeneficioMembresiaOrmEntity>,
  ) {}

  async create(beneficio: BeneficioMembresia): Promise<Result<BeneficioMembresia>> {
    try {
      const beneficioOrm = BeneficioMembresiaMapper.toOrmEntity(beneficio);
      const saved = await this.beneficioRepository.save(beneficioOrm);

      const reloaded = await this.beneficioRepository.findOne({
        where: { id: saved.id },
        relations: ['membresia', 'servicio', 'servicio.especialidad'],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el beneficio creado');
      }

      return Result.success(BeneficioMembresiaMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el beneficio', error);
    }
  }

  async findAll(): Promise<Result<BeneficioMembresia[]>> {
    try {
      const beneficios = await this.beneficioRepository.find({
        relations: ['membresia', 'servicio', 'servicio.especialidad'],
        order: { createdAt: 'DESC' },
      });

      const beneficiosDomain = beneficios.map(BeneficioMembresiaMapper.toDomain);
      return Result.success(beneficiosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los beneficios', error);
    }
  }

  async findById(id: string): Promise<Result<BeneficioMembresia>> {
    try {
      const beneficio = await this.beneficioRepository.findOne({
        where: { id },
        relations: ['membresia', 'servicio', 'servicio.especialidad'],
      });

      if (!beneficio) {
        return Result.failure('Beneficio no encontrado');
      }

      return Result.success(BeneficioMembresiaMapper.toDomain(beneficio));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el beneficio', error);
    }
  }

  async findByMembresiaId(idMembresia: string): Promise<Result<BeneficioMembresia[]>> {
    try {
      const beneficios = await this.beneficioRepository.find({
        where: { membresia: { id: idMembresia } },
        relations: ['membresia', 'servicio', 'servicio.especialidad'],
        order: { createdAt: 'ASC' },
      });

      const beneficiosDomain = beneficios.map(BeneficioMembresiaMapper.toDomain);
      return Result.success(beneficiosDomain);
    } catch (error) {
      console.error('Error en findByMembresiaId:', error);
      return Result.failure('Error al buscar beneficios de la membresía', error);
    }
  }

  async update(id: string, beneficio: BeneficioMembresia): Promise<Result<BeneficioMembresia>> {
    try {
      const exists = await this.beneficioRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Beneficio no encontrado');
      }

      const beneficioOrm = BeneficioMembresiaMapper.toOrmEntity(beneficio);
      await this.beneficioRepository.save(beneficioOrm);

      const updated = await this.beneficioRepository.findOne({
        where: { id },
        relations: ['membresia', 'servicio', 'servicio.especialidad'],
      });

      if (!updated) {
        return Result.failure('Error al recargar el beneficio actualizado');
      }

      return Result.success(BeneficioMembresiaMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el beneficio', error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const result = await this.beneficioRepository.delete(id);
      
      if (result.affected === 0) {
        return Result.failure('Beneficio no encontrado');
      }

      return Result.success(undefined);
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al eliminar el beneficio', error);
    }
  }
}