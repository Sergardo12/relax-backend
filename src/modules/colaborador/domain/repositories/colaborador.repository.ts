import { Colaborador } from "../entities/colaborador.entity";
import { Result } from "src/common/types/result";

export interface ColaboradorRepository {
  create(colaborador: Colaborador): Promise<Result<Colaborador>>;
  findAll(): Promise<Result<Colaborador[]>>;
  findById(id: string): Promise<Result<Colaborador>>;
  findByUsuarioId(usuarioId: string): Promise<Result<Colaborador>>;
  findByEspecialidadId(especialidadId: string): Promise<Result<Colaborador[]>>;
  update(id: string, colaborador: Colaborador): Promise<Result<Colaborador>>;
  delete(id: string): Promise<Result<Colaborador>>;
}
