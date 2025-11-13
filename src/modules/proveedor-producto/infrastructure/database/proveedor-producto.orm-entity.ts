import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstadoProveedorProducto } from '../../domain/enum/proveedor-producto.enum';



@Entity('proveedor')
export class ProveedorProductoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  ruc: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({
    type: 'enum',
    enum: EstadoProveedorProducto,
    default: EstadoProveedorProducto.ACTIVO,
  })
  estado: EstadoProveedorProducto;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ⭐ Relación con CompraProducto (la agregaremos después)
  // @OneToMany(() => CompraProductoOrmEntity, compra => compra.proveedor)
  // compras: CompraProductoOrmEntity[];
}