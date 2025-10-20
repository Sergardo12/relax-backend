import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoMembresia } from '../../domain/enum/membresia.enum';
import { BeneficioMembresiaOrmEntity } from 'src/modules/beneficio-membresia/infrastructure/database/beneficio.membresia.orm-entity';
import { SuscripcionOrmEntity } from 'src/modules/suscripcion/infrastructure/database/suscripcion.orm-entity';

@Entity('membresia')
export class MembresiaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  duracionDias: number; // Duración en días

  @Column({
    type: 'enum',
    enum: EstadoMembresia,
    default: EstadoMembresia.ACTIVA,
  })
  estado: EstadoMembresia;

  @OneToMany(
    () => BeneficioMembresiaOrmEntity,
    (beneficio) => beneficio.membresia,
  )
  beneficios: BeneficioMembresiaOrmEntity[];

  @OneToMany(() => SuscripcionOrmEntity, (suscripcion) => suscripcion.membresia)
  suscripciones: SuscripcionOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
