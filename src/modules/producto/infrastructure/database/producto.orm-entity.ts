import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstadoProducto } from '../../domain/enums/producto.enum';

@Entity('producto')
export class ProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioCosto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 5 })
  stockMinimo: number;

  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @Column({
    type: 'enum',
    enum: EstadoProducto,
    default: EstadoProducto.ACTIVO,
  })
  estado: EstadoProducto;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}