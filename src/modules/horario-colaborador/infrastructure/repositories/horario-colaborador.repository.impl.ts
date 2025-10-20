import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/common/types/result';
import { HorarioColaborador } from '../../domain/entities/horario-colaborador.entity';
import { HorarioColaboradorRepository } from '../../domain/repositories/horario-colaborador.repository';
import { HorarioColaboradorOrmEntity } from '../database/horario-colaborador-entity.orm';
import { HorarioColaboradorMapper } from '../mapper/horario-colaborador.mapper';
import { DiaSemana } from '../../domain/enums/dia-semana.enum';

@Injectable()
export class HorarioColaboradorRepositoryImpl
  implements HorarioColaboradorRepository
{
  constructor(
    @InjectRepository(HorarioColaboradorOrmEntity)
    private horarioColaboradorRepository: Repository<HorarioColaboradorOrmEntity>,
  ) {}

  async create(
    horario: HorarioColaborador,
  ): Promise<Result<HorarioColaborador>> {
    try {
      const ormEntity = HorarioColaboradorMapper.toOrmEntity(horario);
      const savedEntity = await this.horarioColaboradorRepository.save(
        ormEntity,
      );

      // Recargar con todas las relaciones para el toJSON()
      const horarioCompleto = await this.horarioColaboradorRepository.findOne({
        where: { id: savedEntity.id },
        relations: ['colaborador', 'colaborador.usuario', 'colaborador.usuario.rol', 'colaborador.especialidad']
      });

      if (!horarioCompleto) {
        return Result.failure('Error al recargar el horario creado');
      }

      return Result.success(HorarioColaboradorMapper.toDomain(horarioCompleto));
    } catch (error) {
      console.error('Error en create horario:', error);
      return Result.failure('Error al crear horario de colaborador', error);
    }
  }

  async findAll(): Promise<Result<HorarioColaborador[]>> {
    try {
      const horariosOrm = await this.horarioColaboradorRepository.find({
        relations: ['colaborador'],
      });

      const horarios = horariosOrm.map((h) =>
        HorarioColaboradorMapper.toDomain(h),
      );

      return Result.success(horarios);
    } catch (error) {
      return Result.failure(
        'Error al listar los horarios de colaboradores: ' + error.message,
      );
    }
  }

  async findById(id: string): Promise<Result<HorarioColaborador>> {
    try {
      const horarioOrm = await this.horarioColaboradorRepository.findOne({
        where: { id },
        relations: ['colaborador'],
      });

      if (!horarioOrm) {
        return Result.failure('Horario de colaborador no encontrado');
      }

      return Result.success(HorarioColaboradorMapper.toDomain(horarioOrm));
    } catch (error) {
      return Result.failure(
        'Error al buscar horario de colaborador por ID: ' + error.message,
      );
    }
  }

  async findByColaboradorId(
    idColaborador: string,
  ): Promise<Result<HorarioColaborador[]>> {
    try {
      const horariosOrm = await this.horarioColaboradorRepository.find({
        where: { colaborador: { id: idColaborador } },
        relations: ['colaborador'],
      });

      const horarios = horariosOrm.map((h) =>
        HorarioColaboradorMapper.toDomain(h),
      );

      return Result.success(horarios);
    } catch (error) {
      return Result.failure(
        'Error al buscar horarios por colaborador ID: ' + error.message,
      );
    }
  }

  async findByColaboradorAndDia(
    idColaborador: string,
    diaSemana: DiaSemana,
  ): Promise<Result<HorarioColaborador[]>> {
    try {
      const horariosOrm = await this.horarioColaboradorRepository.find({
        where: {
          colaborador: { id: idColaborador },
          diaSemana: diaSemana,
        },
        relations: ['colaborador'],
      });

      const horarios = horariosOrm.map((h) =>
        HorarioColaboradorMapper.toDomain(h),
      );

      return Result.success(horarios);
    } catch (error) {
      return Result.failure(
        'Error al buscar horarios por colaborador y día: ' + error.message,
      );
    }
  }

  async update(id: string, horario: any): Promise<Result<HorarioColaborador>> {
    try {
      // Obtener el horario existente
      const horarioExistenteOrm = await this.horarioColaboradorRepository.findOne(
        {
          where: { id },
          relations: ['colaborador'],
        },
      );

      if (!horarioExistenteOrm) {
        return Result.failure('Horario de colaborador no encontrado');
      }

      // Actualizar solo los campos provistos
      if (horario['diaSemana']) {
        horarioExistenteOrm.diaSemana = horario['diaSemana'];
      }
      if (horario['horaInicio']) {
        horarioExistenteOrm.horaInicio = horario['horaInicio'];
      }
      if (horario['horaFin']) {
        horarioExistenteOrm.horaFin = horario['horaFin'];
      }
      if (horario['estado']) {
        horarioExistenteOrm.estado = horario['estado'];
      }

      const updatedEntity = await this.horarioColaboradorRepository.save(
        horarioExistenteOrm,
      );

      return Result.success(HorarioColaboradorMapper.toDomain(updatedEntity));
    } catch (error) {
      return Result.failure(
        'Error al actualizar horario de colaborador: ' + error.message,
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const horarioOrm = await this.horarioColaboradorRepository.findOne({
        where: { id },
      });

      if (!horarioOrm) {
        return Result.failure('Horario de colaborador no encontrado');
      }

      // Eliminado físico
      await this.horarioColaboradorRepository.delete(id);

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        'Error al eliminar horario de colaborador: ' + error.message,
      );
    }
  }
}
