import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VentaProductoOrmEntity } from './venta-producto.orm-entity';
import { ProductoOrmEntity } from '../../../producto/infrastructure/database/producto.orm-entity';

@Entity('detalle_venta_producto')
export class DetalleVentaProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VentaProductoOrmEntity, (venta) => venta.detalles)
  @JoinColumn({ name: 'idVenta' })
  venta: VentaProductoOrmEntity;

  @ManyToOne(() => ProductoOrmEntity, { eager: true })
  @JoinColumn({ name: 'idProducto' })
  producto: ProductoOrmEntity;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}