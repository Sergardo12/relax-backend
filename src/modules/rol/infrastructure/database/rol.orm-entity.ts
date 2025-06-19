import { UsuarioOrmEntity } from "../../../usuario/infrastructure/database/usuario.orm-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class RolOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombreRol: string

     // 👇 Relación uno-a-muchos: un rol puede tener muchos usuarios
    @OneToMany(() => UsuarioOrmEntity, usuario => usuario.rol)  // Esto significa que un rol puede tener muchos usuarios asociados.
                                                                // El segundo argumento `usuario => usuario.rol` enlaza con el campo inverso en Usuario.
    usuarios?: UsuarioOrmEntity[]

}