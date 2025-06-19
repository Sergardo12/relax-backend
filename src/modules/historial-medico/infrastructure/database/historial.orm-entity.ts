import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";
import { PacienteOrmEntity } from "../../../paciente/infrastructure/database/paciente.orm-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('historial_medico')
export class HistorialMedicoOrmEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fechaHistorial: Date;

  @OneToOne(() => PacienteOrmEntity, (paciente) => paciente.historialMedico,{eager: true})
  @JoinColumn({ name: 'paciente_id' })
  paciente: PacienteOrmEntity;

  @OneToMany(() => CitaOrmEntity, (cita) => cita.historialMedico)
  citas: CitaOrmEntity[];
}