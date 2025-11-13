import { Result } from '../../../../common/types/result';
import { Producto } from '../entities/producto.entity';

export interface ProductoRepository {
  create(producto: Producto): Promise<Result<Producto>>;
  findAll(): Promise<Result<Producto[]>>;
  findById(id: string): Promise<Result<Producto | null>>;
  findByNombre(nombre: string): Promise<Result<Producto[]>>; // ⭐ Opcional: buscar por nombre
  findByCategoria(categoria: string): Promise<Result<Producto[]>>;
  findStockBajo(): Promise<Result<Producto[]>>;
  findVencidos(): Promise<Result<Producto[]>>; // ⭐ Opcional: productos vencidos
  findActivos(): Promise<Result<Producto[]>>; // ⭐ Opcional: solo activos
  update(id: string, producto: Producto): Promise<Result<Producto>>;
  delete(id: string): Promise<Result<boolean>>;
}