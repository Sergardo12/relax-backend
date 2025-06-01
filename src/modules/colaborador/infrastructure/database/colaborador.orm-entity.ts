import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('colaborador')
export class ColaboradorOrmEntity {
    @PrimaryGeneratedColumn()
    idColaborador: number;

    @Column()
    dni: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    password_hash: string;

    @Column()
    fecha_contratacion: Date;

    @Column()
    estado: string;

    @Column()
    tipo: string;
}
