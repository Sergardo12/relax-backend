import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompraProductoOrmEntity } from './compra-producto.orm-entity';
import { ProductoOrmEntity } from '../../../producto/infrastructure/database/producto.orm-entity';

@Entity('detalle_compra_producto')
export class DetalleCompraProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompraProductoOrmEntity, (compra) => compra.detalles)
  @JoinColumn({ name: 'idCompra' })
  compra: CompraProductoOrmEntity;

  @ManyToOne(() => ProductoOrmEntity, { eager: true })
  @JoinColumn({ name: 'idProducto' })
  producto: ProductoOrmEntity;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioCompra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}