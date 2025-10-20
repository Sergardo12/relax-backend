import { Result } from '../../../../common/types/result';
import { SesionTratamiento } from '../entities/sesion-tratamiento.entity';

export interface SesionTratamientoRepository {
  create(sesion: SesionTratamiento): Promise<Result<SesionTratamiento>>;
  findById(id: string): Promise<Result<SesionTratamiento>>;
  findByTratamientoId(idTratamiento: string): Promise<Result<SesionTratamiento[]>>;
  findAll(): Promise<Result<SesionTratamiento[]>>;
  update(id: string, sesion: SesionTratamiento): Promise<Result<SesionTratamiento>>;
  delete(id: string): Promise<Result<SesionTratamiento>>;
}