import { Result } from '../../../../common/types/result';
import { DetalleCompraProducto } from '../entities/detalle-compra-producto.entity';

export interface DetalleCompraProductoRepository {
  create(detalle: DetalleCompraProducto): Promise<Result<DetalleCompraProducto>>;
  findByCompraId(idCompra: string): Promise<Result<DetalleCompraProducto[]>>;
}