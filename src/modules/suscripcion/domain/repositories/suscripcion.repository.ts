import { Result } from 'src/common/types/result';
import { Suscripcion } from '../entities/suscripcion.entity';

export interface SuscripcionRepository {
  create(suscripcion: Suscripcion): Promise<Result<Suscripcion>>;
  findAll(): Promise<Result<Suscripcion[]>>;
  findById(id: string): Promise<Result<Suscripcion>>;
  findByPacienteId(idPaciente: string): Promise<Result<Suscripcion[]>>;
  findActivasByPacienteId(idPaciente: string): Promise<Result<Suscripcion[]>>;
  update(id: string, suscripcion: Suscripcion): Promise<Result<Suscripcion>>;
  delete(id: string): Promise<Result<Suscripcion>>;
}