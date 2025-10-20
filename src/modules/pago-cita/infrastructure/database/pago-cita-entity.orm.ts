import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CitaOrmEntity } from '../../../cita/infrastructure/database/cita-entity.orm';
import { MetodoPagoCita } from '../../domain/enums/metodo-pago-cita.enum';
import { EstadoPagoCita } from '../../domain/enums/estado-pago-cita.enum';

@Entity('pago_cita')
export class PagoCitaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CitaOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCita' })
  cita: CitaOrmEntity;

  @Column({ type: 'varchar', length: 255, nullable: true })
  culqiChargeId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  culqiToken: string | null;

  @Column({ type: 'timestamp' })
  fechaPago: Date;

  @Column({
    type: 'enum',
    enum: MetodoPagoCita,
  })
  metodoPago: MetodoPagoCita;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoTotal: number;

  @Column({ type: 'varchar', length: 3, default: 'PEN' })
  moneda: string;

  @Column({
    type: 'enum',
    enum: EstadoPagoCita,
    default: EstadoPagoCita.PENDIENTE,
  })
  estado: EstadoPagoCita;

  @Column({ type: 'json', nullable: true })
  culqiResponse: any;

  @Column({ type: 'text', nullable: true })
  mensajeError: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  paymentUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
