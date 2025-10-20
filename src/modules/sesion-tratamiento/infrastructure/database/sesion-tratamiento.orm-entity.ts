import { TratamientoOrmEntity } from "src/modules/tratamiento/infrastructure/database/tratamiento.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoSesion } from "../../domain/enum/sesion-tratamiento.enum";

@Entity('sesion_tratamiento')
export class SesionTratamientoOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => TratamientoOrmEntity, tratamiento => tratamiento.sesiones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idTratamiento' })
    tratamiento: TratamientoOrmEntity;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({type: 'varchar', length: 5})
    hora: string;

    @Column({ type: 'text', nullable: true })
    observaciones?: string | null;

    @Column({ 
        type: 'enum', 
        enum: EstadoSesion, 
        default: EstadoSesion.PENDIENTE 
    })
    estado: EstadoSesion;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

}
