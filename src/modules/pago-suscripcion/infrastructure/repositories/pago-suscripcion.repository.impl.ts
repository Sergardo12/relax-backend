import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { PagoSuscripcion } from '../../domain/entities/pago-suscripcion.entity';
import { PagoSuscripcionRepository } from '../../domain/repositories/pago-suscripcion.repository';
import { PagoSuscripcionOrmEntity } from '../database/pago-suscripcion.orm-entity';
import { PagoSuscripcionMapper } from '../mapper/pago-suscripcion.mapper';

@Injectable()
export class PagoSuscripcionRepositoryImpl implements PagoSuscripcionRepository {
  constructor(
    @InjectRepository(PagoSuscripcionOrmEntity)
    private readonly pagoRepository: Repository<PagoSuscripcionOrmEntity>,
  ) {}

  async create(pago: PagoSuscripcion): Promise<Result<PagoSuscripcion>> {
    try {
      const pagoOrm = PagoSuscripcionMapper.toOrmEntity(pago);
      const saved = await this.pagoRepository.save(pagoOrm);

      const reloaded = await this.pagoRepository.findOne({
        where: { id: saved.id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
        ],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el pago creado');
      }

      return Result.success(PagoSuscripcionMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el pago de suscripción', error);
    }
  }

  async findAll(): Promise<Result<PagoSuscripcion[]>> {
    try {
      const pagos = await this.pagoRepository.find({
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
        ],
        order: { fechaPago: 'DESC' },
      });

      const pagosDomain = pagos.map(PagoSuscripcionMapper.toDomain);
      return Result.success(pagosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los pagos', error);
    }
  }

  async findById(id: string): Promise<Result<PagoSuscripcion>> {
    try {
      const pago = await this.pagoRepository.findOne({
        where: { id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
        ],
      });

      if (!pago) {
        return Result.failure('Pago de suscripción no encontrado');
      }

      return Result.success(PagoSuscripcionMapper.toDomain(pago));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el pago de suscripción', error);
    }
  }

  async findBySuscripcionId(idSuscripcion: string): Promise<Result<PagoSuscripcion[]>> {
    try {
      const pagos = await this.pagoRepository.find({
        where: { suscripcion: { id: idSuscripcion } },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
        ],
        order: { fechaPago: 'DESC' },
      });

      const pagosDomain = pagos.map(PagoSuscripcionMapper.toDomain);
      return Result.success(pagosDomain);
    } catch (error) {
      console.error('Error en findBySuscripcionId:', error);
      return Result.failure('Error al buscar pagos de la suscripción', error);
    }
  }

  async update(id: string, pago: PagoSuscripcion): Promise<Result<PagoSuscripcion>> {
    try {
      const exists = await this.pagoRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Pago de suscripción no encontrado');
      }

      const pagoOrm = PagoSuscripcionMapper.toOrmEntity(pago);
      await this.pagoRepository.save(pagoOrm);

      const updated = await this.pagoRepository.findOne({
        where: { id },
        relations: [
          'suscripcion',
          'suscripcion.paciente',
          'suscripcion.paciente.usuario',
          'suscripcion.paciente.usuario.rol',
          'suscripcion.membresia',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar el pago actualizado');
      }

      return Result.success(PagoSuscripcionMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el pago de suscripción', error);
    }
  }
}