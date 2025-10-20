import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleCitaRepository } from '../../domain/repositories/detalle-cita.repository';
import { DetalleCita } from '../../domain/entities/detalle-cita.entity';
import { DetalleCitaOrmEntity } from '../database/detalle-cita-entity.orm';
import { DetalleCitaMapper } from '../mapper/detalle-cita.mapper';
import { Result } from 'src/common/types/result';

@Injectable()
export class DetalleCitaRepositoryImpl implements DetalleCitaRepository {
  constructor(
    @InjectRepository(DetalleCitaOrmEntity)
    private readonly detalleCitaRepository: Repository<DetalleCitaOrmEntity>,
  ) {}

  async create(detalleCita: DetalleCita): Promise<Result<DetalleCita>> {
    try {
      const ormEntity = DetalleCitaMapper.toOrmEntity(detalleCita);
      const savedEntity = await this.detalleCitaRepository.save(ormEntity);
      // Recargar con TODAS las relaciones
      const reloaded = await this.detalleCitaRepository.findOne({
        where: { id: savedEntity.id },
        relations: [
        'cita',
        'cita.paciente',
        'cita.paciente.usuario',
        'cita.paciente.usuario.rol',
        'servicio',
        'servicio.especialidad',
        'colaborador',
        'colaborador.especialidad',
        'colaborador.usuario',
        'colaborador.usuario.rol',
        'consumoBeneficio', 
        'consumoBeneficio.suscripcion', 
        'consumoBeneficio.suscripcion.membresia', 
        'consumoBeneficio.servicio', 
      ],
    });

    if (!reloaded) {
      return Result.failure('Error al recargar el detalle de cita');
    }
      return Result.success(DetalleCitaMapper.toDomain(reloaded));
    } catch (error) {
      return Result.failure('Error al crear el detalle de cita', error);
    }
  }

  async findAll(): Promise<Result<DetalleCita[]>> {
    try {
      const detalles = await this.detalleCitaRepository.find({
        relations: [
        'cita',
        'cita.paciente',
        'cita.paciente.usuario',
        'cita.paciente.usuario.rol',
        'servicio',
        'servicio.especialidad',
        'colaborador',
        'colaborador.especialidad',
        'colaborador.usuario',
        'colaborador.usuario.rol',
        'consumoBeneficio',
        'consumoBeneficio.suscripcion', 
        'consumoBeneficio.suscripcion.membresia', 
        'consumoBeneficio.servicio', 
        ]
      });
      const detallesDomain = detalles.map(DetalleCitaMapper.toDomain);
      return Result.success(detallesDomain);
    } catch (error) {
      return Result.failure('Error al obtener los detalles de cita', error);
    }
  }

  async findById(id: string): Promise<Result<DetalleCita>> {
    try {
      const detalle = await this.detalleCitaRepository.findOne({
        where: { id},
        relations: [
        'cita',
        'cita.paciente',
        'cita.paciente.usuario',
        'cita.paciente.usuario.rol',
        'servicio',
        'servicio.especialidad',
        'colaborador',
        'colaborador.especialidad',
        'colaborador.usuario',
        'colaborador.usuario.rol',
        'consumoBeneficio', 
        'consumoBeneficio.suscripcion', 
        'consumoBeneficio.suscripcion.membresia', 
        'consumoBeneficio.servicio', 
        ]
      });
      if (!detalle) {
        return Result.failure(`No se encontró detalle de cita con ID ${id}`);
      }
      return Result.success(DetalleCitaMapper.toDomain(detalle));
    } catch (error) {
      return Result.failure(
        `Error al buscar el detalle de cita por ID ${id}`,
        error,
      );
    }
  }

  async findByCitaId(idCita: string): Promise<Result<DetalleCita[]>> {
    try {
      const ormEntities = await this.detalleCitaRepository.find({
        where: { cita: { id: idCita },},
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'servicio',
          'servicio.especialidad',
          'colaborador',
          'colaborador.especialidad',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'consumoBeneficio', 
          'consumoBeneficio.suscripcion', 
          'consumoBeneficio.suscripcion.membresia', 
          'consumoBeneficio.servicio', 
        ]
      });

      if(ormEntities.length === 0){
        return Result.success([])
      }
      const detalles = ormEntities.map(DetalleCitaMapper.toDomain);
      return Result.success(detalles);
    } catch (error) {
      console.error('Error en findByCitaId', error) 
      return Result.failure(
        `Error al buscar detalles de la cita ${idCita}`,
        error,
      );
    }
  }

 async update(detalleCita: DetalleCita): Promise<Result<DetalleCita>> {
    try {
      const id = detalleCita.getId();
      const existe = await this.detalleCitaRepository.findOne({
        where: { id },
      });
      
      if (!existe) {
        return Result.failure(`No se encontró detalle de cita con ID ${id}`);
      }

      const ormEntity = DetalleCitaMapper.toOrmEntity(detalleCita);
      await this.detalleCitaRepository.save(ormEntity);

      // Recargar con todas las relaciones después de actualizar
      const updated = await this.detalleCitaRepository.findOne({
        where: { id },
        relations: [
          'cita',
          'cita.paciente',
          'cita.paciente.usuario',
          'cita.paciente.usuario.rol',
          'servicio',
          'servicio.especialidad',
          'colaborador',
          'colaborador.especialidad',
          'colaborador.usuario',
          'colaborador.usuario.rol',
          'consumoBeneficio', // ⭐ NUEVO
          'consumoBeneficio.suscripcion', // ⭐ NUEVO
          'consumoBeneficio.suscripcion.membresia', // ⭐ NUEVO
          'consumoBeneficio.servicio', // ⭐ NUEVO
        ],
      });

      if (!updated) {
        return Result.failure('Error al recargar el detalle actualizado');
      }

      return Result.success(DetalleCitaMapper.toDomain(updated));
    } catch (error) {
      return Result.failure(
        `Error al actualizar detalle de cita con ID ${detalleCita.getId()}`,
        error,
      );
    }
  }


  async delete(id: string): Promise<Result<void>> {
    try {
      const result = await this.detalleCitaRepository.delete(id);
      if (result.affected === 0) {
        return Result.failure(`No se encontró detalle de cita con ID ${id}`);
      }
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        `Error al eliminar detalle de cita con ID ${id}`,
        error,
      );
    }
  }
}
