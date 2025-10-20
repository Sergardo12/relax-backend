import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColaboradorOrmEntity } from 'src/modules/colaborador/infrastructure/database/colaborador.orm-entity';
import { DiaSemana } from '../../domain/enums/dia-semana.enum';
import { EstadoHorarioColaborador } from '../../domain/enums/estado-horario-colaborador.enum';

@Entity('horario_colaborador')
export class HorarioColaboradorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ColaboradorOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idColaborador' })
  colaborador: ColaboradorOrmEntity;

  @Column({ type: 'enum', enum: DiaSemana })
  diaSemana: DiaSemana;

  @Column({ type: 'varchar', length: 5 })
  horaInicio: string;

  @Column({ type: 'varchar', length: 5 })
  horaFin: string;

  @Column({
    type: 'enum',
    enum: EstadoHorarioColaborador,
    default: EstadoHorarioColaborador.ACTIVO,
  })
  estado: EstadoHorarioColaborador;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
