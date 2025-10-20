import { BeneficioMembresiaOrmEntity } from 'src/modules/beneficio-membresia/infrastructure/database/beneficio.membresia.orm-entity';
import { DetalleCitaOrmEntity } from 'src/modules/detalle-cita/infrastructure/database/detalle-cita-entity.orm';
import { ServicioOrmEntity } from 'src/modules/servicio/infrastructure/database/servicio.orm-entity';
import { SuscripcionOrmEntity } from 'src/modules/suscripcion/infrastructure/database/suscripcion.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('consumo_beneficio')
export class ConsumoBeneficioOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => SuscripcionOrmEntity,
    (suscripcion) => suscripcion.consumos,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'idSuscripcion' })
  suscripcion: SuscripcionOrmEntity;

  @ManyToOne(() => ServicioOrmEntity, { eager: true })
  @JoinColumn({ name: 'idServicio' })
  servicio: ServicioOrmEntity;

  @Column({ type: 'int' })
  cantidadTotal: number;

  @Column({ type: 'int', default: 0 })
  cantidadConsumida: number;

  @Column({ type: 'int' })
  cantidadDisponible: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
