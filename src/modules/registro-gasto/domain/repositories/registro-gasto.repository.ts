import { Result } from '../../../../common/types/result';
import { RegistroGasto } from '../entities/registro-gasto.entity';

export interface RegistroGastoRepository {
  create(gasto: RegistroGasto): Promise<Result<RegistroGasto>>;
  findAll(): Promise<Result<RegistroGasto[]>>;
  findById(id: string): Promise<Result<RegistroGasto | null>>;
  findByProveedor(idProveedor: string): Promise<Result<RegistroGasto[]>>;
  findByFecha(fecha: Date): Promise<Result<RegistroGasto[]>>;
  findByCategoria(categoria: string): Promise<Result<RegistroGasto[]>>;
  update(id: string, gasto: RegistroGasto): Promise<Result<RegistroGasto>>;
}