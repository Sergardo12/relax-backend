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
import { ProveedorInsumoOrmEntity } from '../../../proveedor-insumo/infrastructure/database/proveedor-insumo.orm-entity';
import { TipoComprobanteGasto, CategoriaGasto, EstadoGasto } from '../../domain/enums/registro-gasto.enum';
import { DetalleGastoOrmEntity } from './detalle-gasto.orm-entity';

@Entity('registro_gasto')
export class RegistroGastoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProveedorInsumoOrmEntity, { eager: true })
  @JoinColumn({ name: 'idProveedor' })
  proveedor: ProveedorInsumoOrmEntity;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: CategoriaGasto,
  })
  categoria: CategoriaGasto;

  @Column({
    type: 'enum',
    enum: TipoComprobanteGasto,
  })
  tipoComprobante: TipoComprobanteGasto;

  @Column({ type: 'varchar', length: 50 })
  numeroComprobante: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: EstadoGasto,
    default: EstadoGasto.REGISTRADO,
  })
  estado: EstadoGasto;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @OneToMany(() => DetalleGastoOrmEntity, (detalle) => detalle.gasto)
  detalles: DetalleGastoOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}