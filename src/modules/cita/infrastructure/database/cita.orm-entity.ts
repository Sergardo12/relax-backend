import { ServicioOrmEntity } from "../../../servicio/infrastructure/database/servicio.orm-entity";
import { ColaboradorOrmEntity } from "../../../colaborador/infrastructure/database/colaborador.orm-entity";
import { PacienteOrmEntity } from "../../../paciente/infrastructure/database/paciente.orm-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { HistorialMedicoOrmEntity } from "../../../historial-medico/infrastructure/database/historial.orm-entity";
import { PagoCitaOrmEntity } from "../../../pago-cita/infrastructure/database/pago-cita.orm-entity";

// Decorador que indica que esta clase es una entidad de base de datos llamada 'citas'
@Entity('citas')
export class CitaOrmEntity {
  // Clave primaria autogenerada
  @PrimaryGeneratedColumn()
  id: number;

  // Fecha en la que se agenda la cita
  @Column()
  fechaCita: Date;

  // Hora específica de la cita (como string para mayor flexibilidad)
  @Column()
  horaCita: string;

  @Column()
  motivoCita: string;

  @Column({ nullable: true })
  diagnostico: string;

  // Estado actual de la cita (ej: "pendiente", "completada", "cancelada")
  @Column()
  estadoCita: string;

  // Relación muchos a uno con Paciente: una cita está asociada a un solo paciente
  @ManyToOne(() => PacienteOrmEntity, (paciente) => paciente.citas, {eager: true})
  @JoinColumn({ name: 'paciente_id' }) // Nombre de la columna FK en la tabla 'citas'
  paciente: PacienteOrmEntity;

  // Relación muchos a uno con Colaborador: una cita es atendida por un solo colaborador
  @ManyToOne(() => ColaboradorOrmEntity, (colaborador) => colaborador.citas , {eager: true})
  @JoinColumn({ name: 'colaborador_id' }) // Nombre de la columna FK en la tabla 'citas'
  colaborador: ColaboradorOrmEntity;

  // Relación muchos a muchos con Servicios: una cita puede incluir múltiples servicios
  @ManyToMany(() => ServicioOrmEntity, (servicio) => servicio.citas, {eager: true})
  @JoinTable({
    name: 'cita_servicio', // Nombre de la tabla intermedia que une citas y servicios
    joinColumn: { name: 'cita_id', referencedColumnName: 'id' }, // FK hacia la cita
    inverseJoinColumn: { name: 'servicio_id', referencedColumnName: 'id' }, // FK hacia el servicio
  })
  servicios: ServicioOrmEntity[];

  @ManyToOne(() => HistorialMedicoOrmEntity, (historial) => historial.citas, {eager: true})
  @JoinColumn({ name: 'historial_medico_id' })
  historialMedico: HistorialMedicoOrmEntity;

  @OneToOne(() => PagoCitaOrmEntity, pago => pago.cita, {cascade: true, eager: true}) // Relación uno a uno, lado inverso: esta cita tiene un pago.
  pago?: PagoCitaOrmEntity; // Propiedad para acceder al pago relacionado con la cita.
}


/**
 * Entidad ORM que representa la tabla 'citas'.
 * 
 * Relaciones:
 * - Muchos a uno con Paciente (una cita tiene un paciente)
 * - Muchos a uno con Colaborador (una cita es atendida por un colaborador)
 * - Muchos a muchos con Servicios (una cita incluye varios servicios)
 * 
 * Esta estructura permite:
 * - Consultar todas las citas de un paciente o colaborador
 * - Saber qué servicios se brindan en cada cita
 * - Manejar de forma flexible agendamientos complejos
 */
