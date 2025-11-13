import { Result } from '../../../../common/types/result';
import { DetalleVentaProducto } from '../entities/detalle-venta-producto.entity';

export interface DetalleVentaProductoRepository {
  create(detalle: DetalleVentaProducto): Promise<Result<DetalleVentaProducto>>;
  findByVentaId(idVenta: string): Promise<Result<DetalleVentaProducto[]>>;
}