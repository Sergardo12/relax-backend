import { Repository } from 'typeorm';
import { PacienteRepository } from '../../domain/repositories/paciente.repository';
import { PacienteOrmEntity } from '../database/paciente.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Res } from '@nestjs/common';
import { Paciente } from '../../domain/entities/paciente.entity';
import { Result } from '../../../../common/types/result';
import { PacienteMapper } from '../mapper/paciente.mapper';

@Injectable()
export class PacienteRepositoryImpl implements PacienteRepository {
    constructor(
        @InjectRepository(PacienteOrmEntity)
        private readonly pacienteRepository: Repository<PacienteOrmEntity>,
    ) {}

    async create(paciente: Paciente): Promise<Result<Paciente>>{
        try {
            const ormEntity = PacienteMapper.toOrmEntity(paciente);
            const savedEntity = await this.pacienteRepository.save(ormEntity);

            // Recargar con todas las relaciones
            const pacienteCompleto = await this.pacienteRepository.findOne({
                where: { id: savedEntity.id },
                relations: ['usuario', 'usuario.rol']  // ← Cargar usuario y su rol
            });

            if (!pacienteCompleto) {
                return Result.failure('Error al recargar el paciente creado');
            }

            return Result.success(PacienteMapper.toDomain(pacienteCompleto));
        } catch (error) {
            console.error('Error en create:', error);
            return Result.failure('Error al crear el paciente', error);
        }
    }

    async findAll(): Promise<Result<Paciente[]>> {
        try {
            const ormEntities = await this.pacienteRepository.find();
            const pacientes = ormEntities.map(PacienteMapper.toDomain);
            return Result.success(pacientes);
        } catch (error) {
            return Result.failure('Error al obtener los pacientes', error);
        }
    }

    async findById(id: string): Promise<Result<Paciente>> {
        try {
            const ormEntity = await this.pacienteRepository.findOne({ where: { id } });
            if (!ormEntity) {
                return Result.failure(`No se encontró paciente con ID ${id}`);
            }
            return Result.success(PacienteMapper.toDomain(ormEntity));
        } catch (error) {
            return Result.failure(`Error al buscar el paciente por ID ${id}`, error);
        }
    }

    async findByName(nombres: string): Promise<Result<Paciente>> {
        try {
            const ormEntity = await this.pacienteRepository.findOne({ where: { nombres } });
            if (!ormEntity) {
                return Result.failure(`No se encontró paciente con nombre ${nombres}`);
            }
            return Result.success(PacienteMapper.toDomain(ormEntity));
        } catch (error) {
            return Result.failure(`Error al buscar el paciente por nombre ${nombres}`, error);
        }
    }

    async findByDni(dni: string): Promise<Result<Paciente>> {
        try {
            const ormEntity = await this.pacienteRepository.findOne({ where: { dni } });
            if (!ormEntity) {
                return Result.failure(`No se encontró paciente con DNI ${dni}`);
            }
            return Result.success(PacienteMapper.toDomain(ormEntity));
        } catch (error) {
            return Result.failure(`Error al buscar el paciente por DNI ${dni}`, error);
        }
    }

    async findByUsuarioId(usuarioId: string): Promise<Result<Paciente>> {
    try {
        const ormEntity = await this.pacienteRepository.findOne({ 
            where: { usuario: { id: usuarioId } },
            relations: ['usuario', 'usuario.rol']
        });
        
        if (!ormEntity) {
            return Result.failure(`No se encontró paciente para el usuario ${usuarioId}`);
        }
        
        return Result.success(PacienteMapper.toDomain(ormEntity));
    } catch (error) {
        return Result.failure(`Error al buscar paciente por usuario ID ${usuarioId}`, error);
    }
}


    async updateDatosPaciente(id: string, nuevosDatos: Paciente): Promise<Result<Paciente>> {
        try {
    const existe = await this.pacienteRepository.findOne({ where: { id } });
    if (!existe) {
      return Result.failure(`No se encontró paciente con ID ${id}`);
    }

            // Guardamos el objeto completo (con todos los campos)
            const ormEntity = PacienteMapper.toOrmEntity(nuevosDatos);
            ormEntity.id = id; // aseguramos que se actualice el mismo paciente

            const savedEntity = await this.pacienteRepository.save(ormEntity);
            return Result.success(PacienteMapper.toDomain(savedEntity));
        } catch (error) {
            return Result.failure(`Error al actualizar paciente con ID ${id}`, error);
        }
    }

    


}