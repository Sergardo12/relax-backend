import { Result } from '../../../../common/types/result';
import { Tratamiento } from '../entities/tratamiento.entity';

export interface TratamientoRepository {
  create(tratamiento: Tratamiento): Promise<Result<Tratamiento>>;
  findById(id: string): Promise<Result<Tratamiento>>;
  findByPacienteId(idPaciente: string): Promise<Result<Tratamiento[]>>;
  findByColaboradorId(idColaboradorId: string): Promise<Result<Tratamiento[]>>;
  findAll(): Promise<Result<Tratamiento[]>>;
  update(id: string, tratamiento: Tratamiento): Promise<Result<Tratamiento>>;
  delete(id: string): Promise<Result<Tratamiento>>;
}