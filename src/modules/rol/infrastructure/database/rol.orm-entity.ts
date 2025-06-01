import { UsuarioOrmEntity } from "../../../usuario/infrastructure/database/usuario.orm-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class RolOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombreRol: string

    
    @OneToMany(() => UsuarioOrmEntity, usuario => usuario.rol)
    usuarios: UsuarioOrmEntity[]

}