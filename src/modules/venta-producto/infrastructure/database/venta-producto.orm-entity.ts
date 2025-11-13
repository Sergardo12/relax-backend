import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoComprobanteVenta, MetodoPagoVenta, EstadoVenta } from '../../domain/enums/venta-producto.enum';
import { DetalleVentaProductoOrmEntity } from './detalle-venta-producto.orm-entity';

@Entity('venta_producto')
@Index(['tipoComprobante', 'numeroComprobante'], {unique: true})
export class VentaProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoComprobanteVenta,
  })
  tipoComprobante: TipoComprobanteVenta;

  @Column({ type: 'varchar', length: 50 })
  numeroComprobante: string;

  @Column({
    type: 'enum',
    enum: MetodoPagoVenta,
  })
  metodoPago: MetodoPagoVenta;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  igv: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoVenta,
    default: EstadoVenta.COMPLETADA,
  })
  estado: EstadoVenta;

  @Column({ type: 'varchar', length: 200, nullable: true })
  clienteNombre?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  clienteDocumento?: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @OneToMany(() => DetalleVentaProductoOrmEntity, (detalle) => detalle.venta)
  detalles: DetalleVentaProductoOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}