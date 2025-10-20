import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { Suscripcion } from '../../domain/entities/suscripcion.entity';
import { SuscripcionRepository } from '../../domain/repositories/suscripcion.repository';
import { SuscripcionOrmEntity } from '../database/suscripcion.orm-entity';
import { SuscripcionMapper } from '../mapper/suscripcion.mapper';
import { EstadoSuscripcion } from '../../domain/enum/suscripcion.enum';

@Injectable()
export class SuscripcionRepositoryImpl implements SuscripcionRepository {
  constructor(
    @InjectRepository(SuscripcionOrmEntity)
    private readonly suscripcionRepository: Repository<SuscripcionOrmEntity>,
  ) {}

  async create(suscripcion: Suscripcion): Promise<Result<Suscripcion>> {
    try {
      const suscripcionOrm = SuscripcionMapper.toOrmEntity(suscripcion);
      const saved = await this.suscripcionRepository.save(suscripcionOrm);

      const reloaded = await this.suscripcionRepository.findOne({
        where: { id: saved.id },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar la suscripción creada');
      }

      return Result.success(SuscripcionMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear la suscripción', error);
    }
  }

  async findAll(): Promise<Result<Suscripcion[]>> {
    try {
      const suscripciones = await this.suscripcionRepository.find({
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
        order: { createdAt: 'DESC' },
      });

      const suscripcionesDomain = suscripciones.map(SuscripcionMapper.toDomain);
      return Result.success(suscripcionesDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todas las suscripciones', error);
    }
  }

  async findById(id: string): Promise<Result<Suscripcion>> {
    try {
      const suscripcion = await this.suscripcionRepository.findOne({
        where: { id },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
      });

      if (!suscripcion) {
        return Result.failure('Suscripción no encontrada');
      }

      return Result.success(SuscripcionMapper.toDomain(suscripcion));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar la suscripción', error);
    }
  }

  async findByPacienteId(idPaciente: string): Promise<Result<Suscripcion[]>> {
    try {
      const suscripciones = await this.suscripcionRepository.find({
        where: { paciente: { id: idPaciente } },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
        order: { createdAt: 'DESC' },
      });

      const suscripcionesDomain = suscripciones.map(SuscripcionMapper.toDomain);
      return Result.success(suscripcionesDomain);
    } catch (error) {
      console.error('Error en findByPacienteId:', error);
      return Result.failure('Error al buscar suscripciones del paciente', error);
    }
  }

  async findActivasByPacienteId(idPaciente: string): Promise<Result<Suscripcion[]>> {
    try {
      const suscripciones = await this.suscripcionRepository.find({
        where: { 
          paciente: { id: idPaciente },
          estado: EstadoSuscripcion.ACTIVA,
        },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
        order: { fechaFin: 'DESC' },
      });

      const suscripcionesDomain = suscripciones.map(SuscripcionMapper.toDomain);
      return Result.success(suscripcionesDomain);
    } catch (error) {
      console.error('Error en findActivasByPacienteId:', error);
      return Result.failure('Error al buscar suscripciones activas del paciente', error);
    }
  }

  async update(id: string, suscripcion: Suscripcion): Promise<Result<Suscripcion>> {
    try {
      const exists = await this.suscripcionRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Suscripción no encontrada');
      }

      const suscripcionOrm = SuscripcionMapper.toOrmEntity(suscripcion);
      await this.suscripcionRepository.save(suscripcionOrm);

      const updated = await this.suscripcionRepository.findOne({
        where: { id },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar la suscripción actualizada');
      }

      return Result.success(SuscripcionMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar la suscripción', error);
    }
  }

  async delete(id: string): Promise<Result<Suscripcion>> {
    try {
      const suscripcion = await this.suscripcionRepository.findOne({
        where: { id },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
      });

      if (!suscripcion) {
        return Result.failure('Suscripción no encontrada');
      }

      // Borrado lógico: cambiar estado a CANCELADA
      suscripcion.estado = EstadoSuscripcion.CANCELADA;
      await this.suscripcionRepository.save(suscripcion);

      const updated = await this.suscripcionRepository.findOne({
        where: { id },
        relations: [
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'membresia',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar la suscripción cancelada');
      }

      return Result.success(SuscripcionMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al cancelar la suscripción', error);
    }
  }
}