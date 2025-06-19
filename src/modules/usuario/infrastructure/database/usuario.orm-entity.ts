import { RolOrmEntity } from "../../../rol/infrastructure/database/rol.orm-entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('usuario')
export class UsuarioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    correo: string;

    @Column()
    clave: string;
    

   // 👇 Relación muchos-a-uno: muchos usuarios pueden tener un solo rol
    @ManyToOne(() => RolOrmEntity, rol => rol.usuarios) // Esto significa que muchos usuarios pueden pertenecer a un solo rol.
                                                        // El segundo argumento `rol => rol.usuarios` indica el campo inverso en la otra entidad.
    @JoinColumn({ name: 'rol_id' }) // Esto especifica que la columna en la base de datos que guarda el rol asociado se llamará 'rol_id'.
                                    // Sin esto, TypeORM pone un nombre por defecto como 'rolId'.
    rol: RolOrmEntity; // Este es el atributo que contiene el objeto Rol al que pertenece el usuario.
    
}

