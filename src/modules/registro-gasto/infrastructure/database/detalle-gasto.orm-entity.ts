import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RegistroGastoOrmEntity } from './registro-gasto.orm-entity';

@Entity('detalle_gasto')
export class DetalleGastoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RegistroGastoOrmEntity, (gasto) => gasto.detalles)
  @JoinColumn({ name: 'idGasto' })
  gasto: RegistroGastoOrmEntity;

  @Column({ type: 'varchar', length: 300 })
  descripcion: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}