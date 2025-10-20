import { CitaOrmEntity } from "src/modules/cita/infrastructure/database/cita-entity.orm";
import { ColaboradorOrmEntity } from "src/modules/colaborador/infrastructure/database/colaborador.orm-entity";
import { PacienteOrmEntity } from "src/modules/paciente/infrastructure/database/paciente.orm-entity";
import { SesionTratamientoOrmEntity } from "src/modules/sesion-tratamiento/infrastructure/database/sesion-tratamiento.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoTratamiento } from '../../domain/enum/tratamiento.enum';

@Entity('tratamiento')
export class TratamientoOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CitaOrmEntity, { nullable: true })
    @JoinColumn({ name: 'idCita' })
    cita?: CitaOrmEntity;

    @ManyToOne(() => ColaboradorOrmEntity, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idColaborador' })
    colaborador: ColaboradorOrmEntity;

    @ManyToOne(() => PacienteOrmEntity, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idPaciente' })
    paciente: PacienteOrmEntity;

    @Column({ type: 'date' })
    fechaInicio: Date;

    @Column({ type: 'text' })
    diagnostico: string;

    @Column({ type: 'text' })
    tratamiento: string; // Descripción del tratamiento

    @Column({type: 'varchar' ,nullable: true})
    presionArterial?: string | null;

    @Column({ type: 'int', nullable: true })
    pulso?: number | null;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    temperatura?: number | null;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    peso?: number | null;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    saturacion?: number | null;

    @Column({ type: 'int' })
    sesionesTotales: number;

    @Column({ type: 'int', default: 0 })
    sesionesRealizadas: number;

    @Column({ type: 'date', nullable: true })
    fechaFin?: Date | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioTotal: number;

    @Column({ type: 'enum', enum: EstadoTratamiento, default: EstadoTratamiento.ACTIVO }) //por mejorar con enum
    estado: EstadoTratamiento;

    @OneToMany(() => SesionTratamientoOrmEntity, sesion => sesion.tratamiento)
    sesiones: SesionTratamientoOrmEntity[];

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;



}
