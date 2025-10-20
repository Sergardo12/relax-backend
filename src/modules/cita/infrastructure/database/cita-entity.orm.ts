import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PacienteOrmEntity } from '../../../paciente/infrastructure/database/paciente.orm-entity';
import { CitaEstado, EstadoPago } from '../../domain/enums/cita.enum';

@Entity('cita')
export class CitaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PacienteOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idPaciente' })
  paciente: PacienteOrmEntity;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 5 })
  hora: string;

  @Column({
    type: 'enum',
    enum: CitaEstado,
    default: CitaEstado.PENDIENTE,
  })
  estado: CitaEstado;

  @Column({
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE,
  })
  estadoPago: EstadoPago;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
