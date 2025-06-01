import { RolOrmEntity } from "../../../rol/infrastructure/database/rol.orm-entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('usuario')
export class UsuarioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    correo: string;

    @Column()
    clave: string;
    

    //Foreignkey

    @ManyToMany(() => RolOrmEntity, rol => rol.usuarios)
    rol: RolOrmEntity
    
}

