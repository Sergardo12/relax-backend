import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { ConsumoBeneficio } from '../../domain/entities/consumo-beneficio.entity';
import { ConsumoBeneficioRepository } from '../../domain/repositories/consumo-beneficio.repository';
import { ConsumoBeneficioOrmEntity } from '../database/consumo-beneficio.orm-entity';
import { ConsumoBeneficioMapper } from '../mapper/consumo-beneficio.mapper';

@Injectable()
export class ConsumoBeneficioRepositoryImpl implements ConsumoBeneficioRepository {
  constructor(
    @InjectRepository(ConsumoBeneficioOrmEntity)
    private readonly consumoRepository: Repository<ConsumoBeneficioOrmEntity>,
  ) {}

  async create(consumo: ConsumoBeneficio): Promise<Result<ConsumoBeneficio>> {
    try {
      const consumoOrm = ConsumoBeneficioMapper.toOrmEntity(consumo);
      const saved = await this.consumoRepository.save(consumoOrm);

      const reloaded = await this.consumoRepository.findOne({
        where: { id: saved.id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el consumo creado');
      }

      return Result.success(ConsumoBeneficioMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el consumo de beneficio', error);
    }
  }

  async findAll(): Promise<Result<ConsumoBeneficio[]>> {
    try {
      const consumos = await this.consumoRepository.find({
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
        order: { createdAt: 'DESC' },
      });

      const consumosDomain = consumos.map(ConsumoBeneficioMapper.toDomain);
      return Result.success(consumosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los consumos', error);
    }
  }

  async findById(id: string): Promise<Result<ConsumoBeneficio>> {
    try {
      const consumo = await this.consumoRepository.findOne({
        where: { id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
      });

      if (!consumo) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      return Result.success(ConsumoBeneficioMapper.toDomain(consumo));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el consumo de beneficio', error);
    }
  }

  async findBySuscripcionId(idSuscripcion: string): Promise<Result<ConsumoBeneficio[]>> {
    try {
      const consumos = await this.consumoRepository.find({
        where: { suscripcion: { id: idSuscripcion } },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
        order: { createdAt: 'ASC' },
      });

      const consumosDomain = consumos.map(ConsumoBeneficioMapper.toDomain);
      return Result.success(consumosDomain);
    } catch (error) {
      console.error('Error en findBySuscripcionId:', error);
      return Result.failure('Error al buscar consumos de la suscripción', error);
    }
  }

  async findByServicioAndSuscripcion(
    idServicio: string,
    idSuscripcion: string,
  ): Promise<Result<ConsumoBeneficio>> {
    try {
      const consumo = await this.consumoRepository.findOne({
        where: {
          servicio: { id: idServicio },
          suscripcion: { id: idSuscripcion },
        },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
      });

      if (!consumo) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      return Result.success(ConsumoBeneficioMapper.toDomain(consumo));
    } catch (error) {
      console.error('Error en findByServicioAndSuscripcion:', error);
      return Result.failure('Error al buscar el consumo de beneficio', error);
    }
  }

  async update(id: string, consumo: ConsumoBeneficio): Promise<Result<ConsumoBeneficio>> {
    try {
      const exists = await this.consumoRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      const consumoOrm = ConsumoBeneficioMapper.toOrmEntity(consumo);
      await this.consumoRepository.save(consumoOrm);

      const updated = await this.consumoRepository.findOne({
        where: { id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
          'servicio',
          'servicio.especialidad',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar el consumo actualizado');
      }

      return Result.success(ConsumoBeneficioMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el consumo de beneficio', error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const result = await this.consumoRepository.delete(id);

      if (result.affected === 0) {
        return Result.failure('Consumo de beneficio no encontrado');
      }

      return Result.success(undefined);
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al eliminar el consumo de beneficio', error);
    }
  }
}