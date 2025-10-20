import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoRepository } from '../../domain/repositories/sesion-tratamiento.repository';
import { SesionTratamientoOrmEntity } from '../database/sesion-tratamiento.orm-entity';
import { SesionTratamientoMapper } from '../mapper/sesion-tratamiento.mapper';
import { EstadoSesion } from '../../domain/enum/sesion-tratamiento.enum';

@Injectable()
export class SesionTratamientoRepositoryImpl implements SesionTratamientoRepository {
  constructor(
    @InjectRepository(SesionTratamientoOrmEntity)
    private readonly sesionRepository: Repository<SesionTratamientoOrmEntity>,
  ) {}

  async create(sesion: SesionTratamiento): Promise<Result<SesionTratamiento>> {
    try {
      const sesionOrm = SesionTratamientoMapper.toOrmEntity(sesion);
      const saved = await this.sesionRepository.save(sesionOrm);

      // Recargar con relaciones
      const reloaded = await this.sesionRepository.findOne({
        where: { id: saved.id },
         relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar la sesión creada');
      }

      return Result.success(SesionTratamientoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear la sesión', error);
    }
  }

  async findById(id: string): Promise<Result<SesionTratamiento>> {
    try {
      const sesion = await this.sesionRepository.findOne({
        where: { id },
        relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
      });

      if (!sesion) {
        return Result.failure('Sesión no encontrada');
      }

      return Result.success(SesionTratamientoMapper.toDomain(sesion));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar la sesión', error);
    }
  }

  async findByTratamientoId(idTratamiento: string): Promise<Result<SesionTratamiento[]>> {
    try {
      const sesiones = await this.sesionRepository.find({
        where: { tratamiento: { id: idTratamiento } },
        relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
        order: { fecha: 'ASC', hora: 'ASC' },
      });

      const sesionesDomain = sesiones.map(SesionTratamientoMapper.toDomain);
      return Result.success(sesionesDomain);
    } catch (error) {
      console.error('Error en findByTratamientoId:', error);
      return Result.failure('Error al buscar sesiones del tratamiento', error);
    }
  }

  async findAll(): Promise<Result<SesionTratamiento[]>> {
    try {
      const sesiones = await this.sesionRepository.find({
        relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
        order: { fecha: 'ASC', hora: 'ASC' },
      });

      const sesionesDomain = sesiones.map(SesionTratamientoMapper.toDomain);
      return Result.success(sesionesDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todas las sesiones', error);
    }
  }

  async update(id: string, sesion: SesionTratamiento): Promise<Result<SesionTratamiento>> {
    try {
      const exists = await this.sesionRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Sesión no encontrada');
      }

      const sesionOrm = SesionTratamientoMapper.toOrmEntity(sesion);
      await this.sesionRepository.save(sesionOrm);

     // Recargar con TODAS las relaciones
      const updated = await this.sesionRepository.findOne({
        where: { id },
        relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar la sesión actualizada');
      }

      return Result.success(SesionTratamientoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar la sesión', error);
    }
  }

 async delete(id: string): Promise<Result<SesionTratamiento>> {
  try {
    const sesion = await this.sesionRepository.findOne({ 
      where: { id },
      relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
    });

    if (!sesion) {
      return Result.failure('Sesión no encontrada');
    }

    // Borrado lógico: cambiar estado a CANCELADA
    sesion.estado = EstadoSesion.CANCELADA;

    await this.sesionRepository.save(sesion);

   // Recargar con relaciones
      const updated = await this.sesionRepository.findOne({
        where: { id: sesion.id },
        relations: [
          'tratamiento',
          'tratamiento.cita',
          'tratamiento.cita.paciente',
          'tratamiento.cita.paciente.usuario',
          'tratamiento.cita.paciente.usuario.rol',
          'tratamiento.colaborador',
          'tratamiento.colaborador.usuario',
          'tratamiento.colaborador.usuario.rol',
          'tratamiento.colaborador.especialidad',
          'tratamiento.paciente',
          'tratamiento.paciente.usuario',
          'tratamiento.paciente.usuario.rol',
        ],
      });

    if (!updated) {
      return Result.failure('Error al recargar la sesión cancelada');
    }

    return Result.success(SesionTratamientoMapper.toDomain(updated));
  } catch (error) {
    console.error('Error en delete:', error);
    return Result.failure('Error al cancelar la sesión', error);
  }
}
}