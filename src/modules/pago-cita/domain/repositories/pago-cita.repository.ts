import { Result } from '../../../../common/types/result';
import { PagoCita } from '../entities/pago-cita.entity';

export interface PagoCitaRepository {
  create(pagoCita: PagoCita): Promise<Result<PagoCita>>;
  findAll(): Promise<Result<PagoCita[]>>;
  findById(id: string): Promise<Result<PagoCita | null>>;
  findByCitaId(citaId: string): Promise<Result<PagoCita[]>>;
  findByCulqiChargeId(culqiChargeId: string): Promise<Result<PagoCita | null>>;
  update(pagoCita: PagoCita): Promise<Result<PagoCita>>;
}
