import { HistorialMedicoOrmEntity } from "../../../historial-medico/infrastructure/database/historial.orm-entity";
import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";
import { UsuarioOrmEntity } from "../../../usuario/infrastructure/database/usuario.orm-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('paciente')
export class PacienteOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsuarioOrmEntity, { eager: true }) // eager para traer automaticamente el usuario
  @JoinColumn()
  usuario: UsuarioOrmEntity;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  dni: string;

  @Column()
  telefono: string;

  @Column()
  edad: string;

  @Column({ default: true })
  estadoPaciente: boolean;

  @OneToMany(() => CitaOrmEntity, (cita) => cita.paciente)
  citas: CitaOrmEntity[];

  @OneToOne(() => HistorialMedicoOrmEntity, (historial) => historial.paciente)
  historialMedico: HistorialMedicoOrmEntity;
}