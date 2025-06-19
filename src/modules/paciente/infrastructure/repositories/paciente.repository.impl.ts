import { InjectRepository } from "@nestjs/typeorm";
import { PacienteRepository } from "../../domain/repositories/paciente.repository";
import { PacienteOrmEntity } from "../database/paciente.orm-entity";
import { Repository } from "typeorm";
import { Paciente } from "../../domain/entities/paciente.entity";
import { PacienteMapper } from "../mappers/paciente.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PacienteRepositoryImpl implements PacienteRepository {
  constructor(
    @InjectRepository(PacienteOrmEntity)
    private readonly ormRepo: Repository<PacienteOrmEntity>,
  ) {}

  async crear(paciente: Paciente): Promise<Paciente> {
    const ormEntity = PacienteMapper.toOrmEntity(paciente);
    const guardadoOrmEntity = await this.ormRepo.save(ormEntity);
    return PacienteMapper.toDomain(guardadoOrmEntity);
  }

  async buscarPorId(id: number): Promise<Paciente | null> {
    const paciente = await this.ormRepo.findOne({
      where: { id },
      relations: ['usuario', 'usuario.rol'],
    });
    return paciente ? PacienteMapper.toDomain(paciente) : null;
  }

  async listarTodos(): Promise<Paciente[]> {
    const lista = await this.ormRepo.find({
      where: { estadoPaciente: true },
      relations: ['usuario'],
    });
    return lista.map(PacienteMapper.toDomain);
  }

  async actualizar(paciente: Paciente): Promise<Paciente> {
    const ormEntity = PacienteMapper.toOrmEntity(paciente);
    const actualizadoOrmEntity = await this.ormRepo.save(ormEntity);
    return PacienteMapper.toDomain(actualizadoOrmEntity);
  }

  async eliminar(id: number): Promise<void> {
    const paciente = await this.ormRepo.findOne({ where: { id } });
    if (!paciente) throw new Error('Paciente no encontrado');

    paciente.estadoPaciente = false;
    await this.ormRepo.save(paciente);
  }
}