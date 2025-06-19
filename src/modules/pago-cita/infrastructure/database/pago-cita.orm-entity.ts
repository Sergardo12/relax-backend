import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('pagos_cita') // Nombre de la tabla en la base de datos
export class PagoCitaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  monto: number;

  @Column()
  fechaPago: Date;

  @Column()
  metodoPago: string;

  @OneToOne(() => CitaOrmEntity, cita => cita.pago, { onDelete: 'CASCADE'}) // Relación uno a uno: este pago pertenece a UNA sola cita.
  @JoinColumn({name: 'cita_id'})  // Esta entidad (PagoCita) es la dueña de la relación. Tendrá la FK (foreign key).
  cita: CitaOrmEntity; // Propiedad que representa la cita asociada a este pago.
}