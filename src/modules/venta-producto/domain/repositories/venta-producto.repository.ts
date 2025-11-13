import { Result } from '../../../../common/types/result';
import { VentaProducto } from '../entities/venta-producto.entity';

export interface VentaProductoRepository {
  create(venta: VentaProducto): Promise<Result<VentaProducto>>;
  findAll(): Promise<Result<VentaProducto[]>>;
  findById(id: string): Promise<Result<VentaProducto | null>>;
  findByFecha(fecha: Date): Promise<Result<VentaProducto[]>>;
  findByMetodoPago(metodoPago: string): Promise<Result<VentaProducto[]>>;
  update(id: string, venta: VentaProducto): Promise<Result<VentaProducto>>;
}