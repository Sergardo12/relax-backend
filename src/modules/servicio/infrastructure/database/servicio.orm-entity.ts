import { CitaOrmEntity } from "../../../cita//infrastructure/database/cita.orm-entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity('servicios')
export class ServicioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombreServicio: string;

    @Column()
    descripcionServicio: string;

    @Column()
    precioServicio: string;

    @Column()
    duracionServicio: string;

    @Column({default: true})
    estadoServicio: boolean

    @ManyToMany(() => CitaOrmEntity, cita => cita.servicios)
    citas: CitaOrmEntity[];
}
