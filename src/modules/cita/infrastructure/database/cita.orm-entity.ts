import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("citas")
export class CitaOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column()
    hora: string;

    @Column()
    estado: string;
}
