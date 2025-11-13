import { Result } from '../../../../common/types/result';
import { DetalleGasto } from '../entities/detalle-gasto.entity';

export interface DetalleGastoRepository {
  create(detalle: DetalleGasto): Promise<Result<DetalleGasto>>;
  findByGastoId(idGasto: string): Promise<Result<DetalleGasto[]>>;
}