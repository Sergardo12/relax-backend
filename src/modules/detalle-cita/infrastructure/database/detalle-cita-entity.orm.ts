import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CitaOrmEntity } from 'src/modules/cita/infrastructure/database/cita-entity.orm';
import { ServicioOrmEntity } from 'src/modules/servicio/infrastructure/database/servicio.orm-entity';
import { ColaboradorOrmEntity } from 'src/modules/colaborador/infrastructure/database/colaborador.orm-entity';
import { ConsumoBeneficioOrmEntity } from 'src/modules/consumo-beneficio/infrastructure/database/consumo-beneficio.orm-entity';

@Entity('detalle_cita')
export class DetalleCitaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CitaOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCita' })
  cita: CitaOrmEntity;

  @ManyToOne(() => ServicioOrmEntity, { eager: true })
  @JoinColumn({ name: 'idServicio' })
  servicio: ServicioOrmEntity;

  @ManyToOne(() => ColaboradorOrmEntity, { eager: true })
  @JoinColumn({ name: 'idColaborador' })
  colaborador: ColaboradorOrmEntity;

  @ManyToOne(() => ConsumoBeneficioOrmEntity, { nullable: true })
  @JoinColumn({ name: 'idConsumoBeneficio' })
  consumoBeneficio?: ConsumoBeneficioOrmEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'boolean', default: false })
  esConMembresia: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ type: 'text', nullable: true })
  diagnostico?: string;

  @Column({ type: 'text', nullable: true })
  recomendaciones?: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaRegistro?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
