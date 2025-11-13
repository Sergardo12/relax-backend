import { Repository } from 'typeorm';

import { UsuarioOrmEntity } from '../database/usuario-entity.orm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioMapper } from '../mapper/usuario.mapper';
import { EstadoUsuario } from '../../domain/enums/usuario.enum';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';

@Injectable()
export class UsuarioRepositoryImpl implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly usuarioRepo: Repository<UsuarioOrmEntity>,
  ) {}

  async create(usuario: Usuario, contraseñaHasheada: string): Promise<Usuario> {
    const ormEntity = UsuarioMapper.toOrmEntity(usuario, contraseñaHasheada);
    const savedEntity = await this.usuarioRepo.save(ormEntity);
    const usuarioConRol = await this.usuarioRepo.findOne({
      where: {
        id: savedEntity.id,
      },
      relations: ['rol'],
    });

    if (!usuarioConRol)
      throw new ConflictException(
        'No se pudo recuperar el usuario despues de guardarlo',
      );
    return UsuarioMapper.toDomain(usuarioConRol);
  }
  async findById(id: string): Promise<Usuario | null> {
    const ormEntity = await this.usuarioRepo.findOne({
      where: { id },
      relations: ['rol'],
    });
    return ormEntity ? UsuarioMapper.toDomain(ormEntity) : null;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    const ormEntity = await this.usuarioRepo.findOne({
      where: { correo },
      relations: ['rol'],
    });
    return ormEntity ? UsuarioMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Usuario[]> {
    const ormEntities = await this.usuarioRepo.find({
      relations: ['rol'],
    });
    return ormEntities.map(UsuarioMapper.toDomain);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const ormEntity = UsuarioMapper.toOrmEntityWithoutPassword(usuario);
    const updatedEntity = await this.usuarioRepo.save(ormEntity);
    return UsuarioMapper.toDomain(updatedEntity);
  }

  async marcarPerfilCompleto(id: string): Promise<void> {
  await this.usuarioRepo.update(id, { perfilCompleto: true });
  }

  async updateContraseña(
    id: string,
    contraseñaHasheada: string,
  ): Promise<void> {
    await this.usuarioRepo.update(id, { contraseña: contraseñaHasheada });
  }

  async delete(id: string): Promise<void> {
    await this.usuarioRepo.update(id, { estado: EstadoUsuario.INACTIVO });
  }
}