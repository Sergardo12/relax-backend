import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoCompraProducto, TipoComprobanteCompraProducto } from '../../domain/enums/compra-producto.enum';
import { ProveedorProductoOrmEntity } from 'src/modules/proveedor-producto/infrastructure/database/proveedor-producto.orm-entity';
import { DetalleCompraProductoOrmEntity } from './detalle-compra-producto.orm-entity';

@Entity('compra_producto')
export class CompraProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProveedorProductoOrmEntity, { eager: true })
  @JoinColumn({ name: 'idProveedor' })
  proveedor: ProveedorProductoOrmEntity;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoComprobanteCompraProducto,
  })
  tipoComprobante: TipoComprobanteCompraProducto;

  @Column({ type: 'varchar', length: 50 })
  numeroComprobante: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoCompraProducto,
    default: EstadoCompraProducto.REGISTRADA,
  })
  estado: EstadoCompraProducto;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @OneToMany(() => DetalleCompraProductoOrmEntity, (detalle) => detalle.compra)
  detalles: DetalleCompraProductoOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}