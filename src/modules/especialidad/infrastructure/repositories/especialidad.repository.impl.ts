import { Injectable } from "@nestjs/common";
import { Especialidad } from "../../domain/entities/especialidad.entity";
import { Result } from "src/common/types/result";
import { InjectRepository } from "@nestjs/typeorm";
import { EspecialidadOrmEntity } from "../database/especialidad.orm-entity";
import { EspecialidadRepository } from "../../domain/repositories/especialidad.repository";
import { Repository } from "typeorm";
import { EspecialidadMapper } from "../mapper/especialidad.mapper";
import { EstadoEspecialidad } from "../../domain/enums/especialidad.enums";

@Injectable()
export class EspecialidadRepositoryImpl implements EspecialidadRepository {
  constructor(
    @InjectRepository(EspecialidadOrmEntity)
    private readonly especialidadRepository: Repository<EspecialidadOrmEntity>,
  ) {}

  // Crear una nueva especialidad
  async create(especialidad: Especialidad): Promise<Result<Especialidad>> {
    try {
      const ormEntity = EspecialidadMapper.toOrmEntity(especialidad);
      const savedEntity = await this.especialidadRepository.save(ormEntity);
      return Result.success(EspecialidadMapper.toDomain(savedEntity));
    } catch (error) {
      return Result.failure('No se pudo crear la especialidad', error);
    }
  }

  // Obtener todas las especialidades
  async findAll(): Promise<Result<Especialidad[]>> {
    try {
      const entities = await this.especialidadRepository.find();
      const especialidades = entities.map(EspecialidadMapper.toDomain);
      return Result.success(especialidades);
    } catch (error) {
      return Result.failure('No se pudieron obtener las especialidades', error);
    }
  }

  // Buscar especialidad por ID
  async findById(id: string): Promise<Result<Especialidad>> {
    try {
      const entity = await this.especialidadRepository.findOne({
        where: { id },
      });
      if (!entity)
        return Result.failure(`No se encontró la especialidad con id ${id}`);
      return Result.success(EspecialidadMapper.toDomain(entity));
    } catch (error) {
      return Result.failure('Error al buscar la especialidad por id', error);
    }
  }

  // Buscar especialidad por nombre
  async findByName(nombre: string): Promise<Result<Especialidad>> {
    try {
      const entity = await this.especialidadRepository.findOne({
        where: { nombre },
      });

      if (!entity) {
        return Result.failure(
          `No se encontró una especialidad con el nombre '${nombre}'.`,
        );
      }

      return Result.success(EspecialidadMapper.toDomain(entity));
    } catch (error) {
      return Result.failure(
        'Error al buscar la especialidad por nombre',
        error,
      );
    }
  }

  // Actualizar especialidad
  async update(
    id: string,
    nuevosDatos: Partial<Especialidad>,
  ): Promise<Result<Especialidad>> {
    try {
      const entity = await this.especialidadRepository.findOne({
        where: { id },
      });
      if (!entity)
        return Result.failure(`No se encontró la especialidad con id ${id}`);

      // Actualizamos solo los campos proporcionados
      Object.assign(entity, nuevosDatos);

      const updatedEntity = await this.especialidadRepository.save(entity);
      return Result.success(EspecialidadMapper.toDomain(updatedEntity));
    } catch (error) {
      return Result.failure('No se pudo actualizar la especialidad', error);
    }
  }

  // Eliminar especialidad
  async delete(id: string): Promise<Result<Especialidad>> {
    try {
      const entity = await this.especialidadRepository.findOne({
        where: { id },
      });
      if (!entity)
        return Result.failure(`No se encontró la especialidad con id ${id}`);

      entity.estado = EstadoEspecialidad.INACTIVO;
      const updated = await this.especialidadRepository.save(entity);
      return Result.success(EspecialidadMapper.toDomain(updated));
    } catch (error) {
      return Result.failure('No se pudo eliminar la especialidad', error);
    }
  }
}

   


    
