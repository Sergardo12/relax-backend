import { MembresiaOrmEntity } from "src/modules/membresia/infrastructure/database/membresia.orm-entity";
import { ServicioOrmEntity } from "src/modules/servicio/infrastructure/database/servicio.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('beneficio_membresia')
export class BeneficioMembresiaOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => MembresiaOrmEntity, membresia => membresia.beneficios, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idMembresia' })
    membresia: MembresiaOrmEntity;

    @ManyToOne(() => ServicioOrmEntity, { eager: true})
    @JoinColumn({ name: 'idServicio' })
    servicio: ServicioOrmEntity;

    @Column({type: 'int'})
    cantidad: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    


}