import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('usuario')
export class UsuarioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    correo: string;

    @Column()
    clave: string;
    
}

