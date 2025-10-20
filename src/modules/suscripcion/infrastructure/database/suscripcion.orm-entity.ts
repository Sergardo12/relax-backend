import { MembresiaOrmEntity } from "src/modules/membresia/infrastructure/database/membresia.orm-entity";
import { PacienteOrmEntity } from "src/modules/paciente/infrastructure/database/paciente.orm-entity";
import { PagoSuscripcionOrmEntity } from "src/modules/pago-suscripcion/infrastructure/database/pago-suscripcion.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoSuscripcion } from "../../domain/enum/suscripcion.enum";
import { ConsumoBeneficioOrmEntity } from "src/modules/consumo-beneficio/infrastructure/database/consumo-beneficio.orm-entity";

@Entity('suscripcion')
export class SuscripcionOrmEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PacienteOrmEntity, {eager: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'idPaciente' })
    paciente: PacienteOrmEntity;

    @ManyToOne(() => MembresiaOrmEntity, { eager: true })
    @JoinColumn({ name: 'idMembresia' })
    membresia: MembresiaOrmEntity;

    @Column({ type: 'date', nullable: true }) // NOT_NULL
    fechaInicio?: Date;

    @Column({ type: 'date',  nullable: true})
    fechaFin?: Date;

    @Column({
    type: 'enum',
    enum: EstadoSuscripcion,
    default: EstadoSuscripcion.PENDIENTE_PAGO,
    })
    estado: EstadoSuscripcion;

    @OneToMany(() => ConsumoBeneficioOrmEntity, consumo => consumo.suscripcion)
    consumos: ConsumoBeneficioOrmEntity[];

    @OneToMany(() => PagoSuscripcionOrmEntity, pago => pago.suscripcion)
    pagos: PagoSuscripcionOrmEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}