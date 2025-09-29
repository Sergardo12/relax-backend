import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../../domain/repositories/rol.repository';
import { RolOrmEntity } from '../database/rol.orm-entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Rol } from '../../domain/entities/rol.entity';
import { RolMapper } from '../mapper/rol.mapper';
import { EstadoRol } from '../../domain/enums/rol.enum';

@Injectable()
export class RolRepositoryImpl implements RolRepository {
    constructor(
        @InjectRepository(RolOrmEntity)
        private readonly rolRepository: Repository<RolOrmEntity>,
    ) {}

    async create(rol: Rol): Promise<Rol> {
        const ormEntity = RolMapper.toOrmEntity(rol);
        const savedEntity = await this.rolRepository.save(ormEntity);
        return RolMapper.toDomain(savedEntity);
    }   

    async findById(id: string): Promise<Rol | null> {
        const ormEntity = await this.rolRepository.findOne({ where: { id } });
        return ormEntity ? RolMapper.toDomain(ormEntity) : null;
    }

    async findAll(): Promise<Rol[]> {
        const ormEntities = await this.rolRepository.find();
        return ormEntities.map(RolMapper.toDomain);
    }

    async update(rol: Rol): Promise<Rol> {
        const ormEntity = RolMapper.toOrmEntity(rol);
        const updatedEntity = await this.rolRepository.save(ormEntity);
        return RolMapper.toDomain(updatedEntity);
    }

    async delete(id: string): Promise<boolean> {
        const rol  = await this.rolRepository.findOne({
            where: { id },
        })
        if(!rol) return false;
        rol.estado = EstadoRol.INACTIVO;
        await this.rolRepository.save(rol);
        return true;
    }

    async findByName(nombre: string): Promise<Rol | null> {
        const ormEntity = await this.rolRepository.findOne({ where: { nombre: nombre } });
        return ormEntity ? RolMapper.toDomain(ormEntity) : null;
    }

    
}