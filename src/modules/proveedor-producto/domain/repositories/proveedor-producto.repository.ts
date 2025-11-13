import { Result } from '../../../../common/types/result';
import { ProveedorProducto } from '../entities/proveedor-producto.entity';


export interface ProveedorProductoRepository {
  create(proveedor: ProveedorProducto): Promise<Result<ProveedorProducto>>;
  findAll(): Promise<Result<ProveedorProducto[]>>;
  findById(id: string): Promise<Result<ProveedorProducto | null>>;
  findActivos(): Promise<Result<ProveedorProducto[]>>;
  update(id: string, proveedor: ProveedorProducto): Promise<Result<ProveedorProducto>>;
  delete(id: string): Promise<Result<boolean>>;
}