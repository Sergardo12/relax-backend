import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('servicios')
export class ServicioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombreservicio: string;

    @Column()
    descripcionservicio: string;

    @Column()
    precioservicio: string;

    @Column()
    duracion: string;
}
