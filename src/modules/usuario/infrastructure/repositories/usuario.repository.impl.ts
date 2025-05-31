import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioRepository } from "../../domain/repositories/usuario.repository";
import { Repository } from "typeorm";
import { UsuarioOrmEntity } from "../database/usuario.orm-entity";
import { Injectable } from "@nestjs/common";
import { Usuario } from "../../domain/entities/usuario.entity";
import { UsuarioMapper } from "../mappers/usuario.mapper";


@Injectable()
export class UsuarioRepositoryImpl implements UsuarioRepository{
    constructor(
        @InjectRepository(UsuarioOrmEntity)
        private readonly ormRepo: Repository<UsuarioOrmEntity>,
    ){}


    async crear(usuario: Usuario): Promise<Usuario> {
        const ormEntity = UsuarioMapper.toOrmEntity(usuario);
        const savedOrmEntity = await this.ormRepo.save(ormEntity);
        return UsuarioMapper.toDamain(savedOrmEntity);
    }
}