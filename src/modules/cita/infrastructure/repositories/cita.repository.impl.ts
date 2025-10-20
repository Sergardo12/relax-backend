import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { Cita } from '../../domain/entities/cita.entity';
import { CitaOrmEntity } from '../database/cita-entity.orm';
import { CitaMapper } from '../mapper/cita.mapper';
import { Result } from '../../../../common/types/result';
import { CitaEstado } from '../../domain/enums/cita.enum';

@Injectable()
export class CitaRepositoryImpl implements CitaRepository {
  constructor(
    @InjectRepository(CitaOrmEntity)
    private readonly citaRepository: Repository<CitaOrmEntity>,
  ) {}

  async create(cita: Cita): Promise<Result<Cita>> {
    try {
      const ormEntity = CitaMapper.toOrmEntity(cita);
      const savedEntity = await this.citaRepository.save(ormEntity);

      // Recargar con todas las relaciones para el toJSON()
      const citaCompleta = await this.citaRepository.findOne({
        where: { id: savedEntity.id },
        relations: ['paciente', 'paciente.usuario', 'paciente.usuario.rol']
      });

      if (!citaCompleta) {
        return Result.failure('Error al recargar la cita creada');
      }

      return Result.success(CitaMapper.toDomain(citaCompleta));
    } catch (error) {
      console.error('Error en create cita:', error);
      return Result.failure('Error al crear la cita', error);
    }
  }

  async findAll(): Promise<Result<Cita[]>> {
    try {
      const ormEntities = await this.citaRepository.find();
      const citas = ormEntities.map(CitaMapper.toDomain);
      return Result.success(citas);
    } catch (error) {
      return Result.failure('Error al obtener las citas', error);
    }
  }

  async findById(id: string): Promise<Result<Cita | null>> {
    try {
      const ormEntity = await this.citaRepository.findOne({ where: { id } });
      if (!ormEntity) {
        return Result.success(null);
      }
      return Result.success(CitaMapper.toDomain(ormEntity));
    } catch (error) {
      return Result.failure(`Error al buscar la cita por ID ${id}`, error);
    }
  }

  async findByPacienteId(pacienteId: string): Promise<Result<Cita[]>> {
   try {
    const citasOrm = await this.citaRepository.find({
      where: { paciente: { id: pacienteId } },
      relations: ['paciente', 'paciente.usuario'],
      order: { fecha: 'DESC', hora: 'DESC' },
    });

    const citas = citasOrm.map(CitaMapper.toDomain);
    return Result.success(citas);
  } catch (error) {
    console.error('Error al buscar citas por paciente:', error);
    return Result.failure('Error al buscar citas del paciente', error);
  }
  }

  async findByFecha(fecha: Date): Promise<Result<Cita[]>> {
    try {
      const ormEntities = await this.citaRepository.find({
        where: { fecha },
      });
      const citas = ormEntities.map(CitaMapper.toDomain);
      return Result.success(citas);
    } catch (error) {
      return Result.failure('Error al buscar citas por fecha', error);
    }
  }

  async findByEstado(estado: CitaEstado): Promise<Result<Cita[]>> {
    try {
      const ormEntities = await this.citaRepository.find({
        where: { estado },
      });
      const citas = ormEntities.map(CitaMapper.toDomain);
      return Result.success(citas);
    } catch (error) {
      return Result.failure('Error al buscar citas por estado', error);
    }
  }

  async update(id: string, cita: Cita): Promise<Result<Cita>> {
    try {
      const existe = await this.citaRepository.findOne({ where: { id } });
      if (!existe) {
        return Result.failure(`No se encontró cita con ID ${id}`);
      }

      const ormEntity = CitaMapper.toOrmEntity(cita);
      ormEntity.id = id;

      const savedEntity = await this.citaRepository.save(ormEntity);
      return Result.success(CitaMapper.toDomain(savedEntity));
    } catch (error) {
      return Result.failure(`Error al actualizar cita con ID ${id}`, error);
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.citaRepository.delete(id);
      if (result.affected === 0) {
        return Result.failure(`No se encontró cita con ID ${id}`);
      }
      return Result.success(true);
    } catch (error) {
      return Result.failure(`Error al eliminar cita con ID ${id}`, error);
    }
  }
}
