import { Result } from '../../../../common/types/result';
import { CompraProducto } from '../entities/compra-producto.entity';

export interface CompraProductoRepository {
  create(compra: CompraProducto): Promise<Result<CompraProducto>>;
  findAll(): Promise<Result<CompraProducto[]>>;
  findById(id: string): Promise<Result<CompraProducto | null>>;
  findByProveedor(idProveedor: string): Promise<Result<CompraProducto[]>>;
  findByFecha(fecha: Date): Promise<Result<CompraProducto[]>>;
  update(id: string, compra: CompraProducto): Promise<Result<CompraProducto>>;
}