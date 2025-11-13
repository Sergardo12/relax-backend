import { Result } from '../../../../common/types/result';
import { ProveedorInsumo } from '../entities/proveedor-insumo.entity';

export interface ProveedorInsumoRepository {
  create(proveedor: ProveedorInsumo): Promise<Result<ProveedorInsumo>>;
  findAll(): Promise<Result<ProveedorInsumo[]>>;
  findById(id: string): Promise<Result<ProveedorInsumo | null>>;
  findActivos(): Promise<Result<ProveedorInsumo[]>>;
  update(id: string, proveedor: ProveedorInsumo): Promise<Result<ProveedorInsumo>>;
  delete(id: string): Promise<Result<boolean>>;
}