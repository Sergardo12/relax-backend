import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstadoProveedorInsumo } from '../../domain/enums/proveedor-insumo.enum';

@Entity('proveedor_insumo')
export class ProveedorInsumoOrmEntity {
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
    enum: EstadoProveedorInsumo,
    default: EstadoProveedorInsumo.ACTIVO,
  })
  estado: EstadoProveedorInsumo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}