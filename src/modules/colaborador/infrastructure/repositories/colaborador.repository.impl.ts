import { Repository } from "typeorm"; 
import { Colaborador } from "../../domain/entities/colaborador.entity";
import { ColaboradorRepository } from "../../domain/repositories/colaborador.repository";
import { ColaboradorOrmEntity } from "../database/colaborador.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Result } from "src/common/types/result";
import { ColaboradorMapper } from "../mapper/colaborador.mapper";
import { Injectable } from "@nestjs/common";
import { EstadoUsuario } from "src/modules/usuario/domain/enums/usuario.enum";


@Injectable()
export class ColaboradorRepositoryImpl implements ColaboradorRepository {
  constructor(
    @InjectRepository(ColaboradorOrmEntity)
    private colaboradorRepository: Repository<ColaboradorOrmEntity>
  ) {}

  // ✅ Crear colaborador
  async create(colaborador: Colaborador): Promise<Result<Colaborador>> {
    try {
      const ormEntity = ColaboradorMapper.toOrmEntity(colaborador);
      const savedEntity = await this.colaboradorRepository.save(ormEntity);
      return Result.success(ColaboradorMapper.toDomain(savedEntity));
    } catch (error) {
      return Result.failure('Error al crear colaborador: ' , error);
    }
  }

  // ✅ Listar todos los colaboradores activos
  async findAll(): Promise<Result<Colaborador[]>> {
    try {
      const colaboradoresOrm = await this.colaboradorRepository.find({
        relations: ["usuario", "especialidad"],
        where: { usuario: { estado: EstadoUsuario.ACTIVO}},
      });

      const colaboradores = colaboradoresOrm.map((col) =>
        ColaboradorMapper.toDomain(col),
      );

      return Result.success(colaboradores);
    } catch (error) {
      return Result.failure('Error al listar los colaboradores: ' + error.message);
    }
  }

  // ✅ Buscar por ID
  async findById(id: string): Promise<Result<Colaborador>> {
    try {
      const colaboradorOrm = await this.colaboradorRepository.findOne({
        where: { id },
        relations: ["usuario", "especialidad"],
      });

      if (!colaboradorOrm)
        return Result.failure('Colaborador no encontrado');

      return Result.success(ColaboradorMapper.toDomain(colaboradorOrm));
    } catch (error) {
      return Result.failure('Error al buscar colaborador por ID: ' + error.message);
    }
  }

  // ✅ Buscar por Usuario ID
  async findByUsuarioId(usuarioId: string): Promise<Result<Colaborador>> {
    try {
      const colaboradorOrm = await this.colaboradorRepository.findOne({
        where: { usuario: { id: usuarioId } },
        relations: ["usuario", "especialidad"],
      });

      if (!colaboradorOrm) {
        return Result.failure('Colaborador no encontrado');
      }

      return Result.success(ColaboradorMapper.toDomain(colaboradorOrm));
    } catch (error) {
      return Result.failure('Error al buscar colaborador por usuario ID: ' + error.message);
    }
  }

  // ✅ Buscar por Especialidad ID
  async findByEspecialidadId(especialidadId: string): Promise<Result<Colaborador[]>> {
    try {
      const colaboradoresOrm = await this.colaboradorRepository.find({
        where: { especialidad: { id: especialidadId } },
        relations: ["usuario", "especialidad"],
      });

      const colaboradores = colaboradoresOrm.map((col) =>
        ColaboradorMapper.toDomain(col),
      );

      return Result.success(colaboradores);
    } catch (error) {
      return Result.failure('Error al buscar colaboradores por especialidad: ' + error.message);
    }
  }

  // ✅ Actualizar colaborador
  async update(id: string, colaborador: Colaborador): Promise<Result<Colaborador>> {
    try {
      const colaboradorOrm = ColaboradorMapper.toOrmEntity(colaborador);
      await this.colaboradorRepository.update(id, colaboradorOrm);

      const updatedColaboradorOrm = await this.colaboradorRepository.findOne({
        where: { id },
        relations: ["usuario", "especialidad"],
      });

      if (!updatedColaboradorOrm) {
        return Result.failure('Colaborador no encontrado después de actualizar');
      }

      return Result.success(ColaboradorMapper.toDomain(updatedColaboradorOrm));
    } catch (error) {
      return Result.failure('Error al actualizar colaborador: ' + error.message);
    }
  }

  // ✅ “Eliminar” colaborador (Soft delete → estado INACTIVO)
  async delete(id: string): Promise<Result<Colaborador>> {
    try {
      const colaboradorOrm = await this.colaboradorRepository.findOne({
        where: { id },
        relations: ["usuario"],
      });

      if (!colaboradorOrm)
        return Result.failure('Colaborador no encontrado');

      colaboradorOrm.usuario.estado = EstadoUsuario.INACTIVO;
      const updated = await this.colaboradorRepository.save(colaboradorOrm);

      return Result.success(ColaboradorMapper.toDomain(updated));
    } catch (error) {
      return Result.failure('Error al eliminar colaborador: ' + error.message);
    }
  }
}
