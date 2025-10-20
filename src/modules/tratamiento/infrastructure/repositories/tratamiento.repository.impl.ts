import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';
import { TratamientoRepository } from '../../domain/repositories/tratamiento.repository';
import { TratamientoOrmEntity } from '../database/tratamiento.orm-entity';
import { TratamientoMapper } from '../mapper/tratamiento.mapper';
import { EstadoTratamiento } from '../../domain/enum/tratamiento.enum';

@Injectable()
export class TratamientoRepositoryImpl implements TratamientoRepository {
  constructor(
    @InjectRepository(TratamientoOrmEntity)
    private readonly tratamientoRepository: Repository<TratamientoOrmEntity>,
  ) {}

  async create(tratamiento: Tratamiento): Promise<Result<Tratamiento>> {
    try {
      const tratamientoOrm = TratamientoMapper.toOrmEntity(tratamiento);
      const saved = await this.tratamientoRepository.save(tratamientoOrm);
      
     // Recargar con TODAS las relaciones anidadas
      const reloaded = await this.tratamientoRepository.findOne({
        where: { id: saved.id },
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
        ],
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el tratamiento creado');
      }

      return Result.success(TratamientoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el tratamiento', error);
    }
  }

  async findById(id: string): Promise<Result<Tratamiento>> {
    try {
      const tratamiento = await this.tratamientoRepository.findOne({
        where: {id},
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
      });

      if (!tratamiento) {
        return Result.failure('Tratamiento no encontrado');
      }

      return Result.success(TratamientoMapper.toDomain(tratamiento));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el tratamiento', error);
    }
  }

  async findByPacienteId(idPaciente: string): Promise<Result<Tratamiento[]>> {
    try {
      const tratamientos = await this.tratamientoRepository.find({
        where: { paciente: { id: idPaciente } },
       relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
        order: { fechaInicio: 'DESC' },
      });

      const tratamientosDomain = tratamientos.map(TratamientoMapper.toDomain);
      return Result.success(tratamientosDomain);
    } catch (error) {
      console.error('Error en findByPacienteId:', error);
      return Result.failure('Error al buscar tratamientos del paciente', error);
    }
  }

  async findByColaboradorId(idColaborador: string): Promise<Result<Tratamiento[]>> {
    try {
      const tratamientos = await this.tratamientoRepository.find({
        where: { colaborador: { id: idColaborador } },
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
        order: { fechaInicio: 'DESC' },
      });

      const tratamientosDomain = tratamientos.map(TratamientoMapper.toDomain);
      return Result.success(tratamientosDomain);
    } catch (error) {
      console.error('Error en findByColaboradorId:', error);
      return Result.failure('Error al buscar tratamientos del colaborador', error);
    }
  }

  async findAll(): Promise<Result<Tratamiento[]>> {
    try {
      const tratamientos = await this.tratamientoRepository.find({
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
        order: { fechaInicio: 'DESC' },
      });

      const tratamientosDomain = tratamientos.map(TratamientoMapper.toDomain);
      return Result.success(tratamientosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los tratamientos', error);
    }
  }

  async update(id: string, tratamiento: Tratamiento): Promise<Result<Tratamiento>> {
    try {
      const exists = await this.tratamientoRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Tratamiento no encontrado');
      }

      const tratamientoOrm = TratamientoMapper.toOrmEntity(tratamiento);
      await this.tratamientoRepository.save(tratamientoOrm);

      // Recargar con TODAS las relaciones
      const updated = await this.tratamientoRepository.findOne({
        where: { id },
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar el tratamiento actualizado');
      }

      return Result.success(TratamientoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el tratamiento', error);
    }
  }

  async delete(id: string): Promise<Result<Tratamiento>> {
  try {
    const tratamiento = await this.tratamientoRepository.findOne({ 
      where: { id },
      relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
        ],
    });

    if (!tratamiento) {
      return Result.failure('Tratamiento no encontrado');
    }

    // Borrado lógico: cambiar estado a CANCELADO
    tratamiento.estado = EstadoTratamiento.CANCELADO;
    tratamiento.fechaFin = new Date();

    await this.tratamientoRepository.save(tratamiento);

    // Recargar con todas las relaciones
      const updated = await this.tratamientoRepository.findOne({
        where: { id },
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'colaborador',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'colaborador.especialidad',
          'paciente',
          'paciente.usuario',
          'paciente.usuario.rol',
          'sesiones',
        ],
    });

    if (!updated) {
      return Result.failure('Error al recargar el tratamiento cancelado');
    }

    return Result.success(TratamientoMapper.toDomain(updated));
  } catch (error) {
    console.error('Error en delete:', error);
    return Result.failure('Error al cancelar el tratamiento', error);
  }
}
}