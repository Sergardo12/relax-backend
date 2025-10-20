import { Result } from '../../../../common/types/result';
import { Cita } from '../entities/cita.entity';
import { CitaEstado } from '../enums/cita.enum';

export interface CitaRepository {
  create(cita: Cita): Promise<Result<Cita>>;
  findAll(): Promise<Result<Cita[]>>;
  findById(id: string): Promise<Result<Cita | null>>;
  findByPacienteId(pacienteId: string): Promise<Result<Cita[]>>;
  findByFecha(fecha: Date): Promise<Result<Cita[]>>;
  findByEstado(estado: CitaEstado): Promise<Result<Cita[]>>;
  update(id: string, cita: Cita): Promise<Result<Cita>>;
  delete(id: string): Promise<Result<boolean>>;
}