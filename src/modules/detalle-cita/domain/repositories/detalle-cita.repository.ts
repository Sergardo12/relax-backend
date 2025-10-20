import { Result } from 'src/common/types/result';
import { DetalleCita } from '../entities/detalle-cita.entity';

export interface DetalleCitaRepository {
  create(detalleCita: DetalleCita): Promise<Result<DetalleCita>>;
  findAll(): Promise<Result<DetalleCita[]>>;
  findById(id: string): Promise<Result<DetalleCita>>;
  findByCitaId(idCita: string): Promise<Result<DetalleCita[]>>;
  update(detalleCita: DetalleCita): Promise<Result<DetalleCita>>;
  delete(id: string): Promise<Result<void>>;
}
