import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadoUsuario } from "../../domain/enums/usuario.enum";
import { RolOrmEntity } from "src/modules/Rol/infrastructure/database/rol.orm-entity";

@Entity('usuario')
export class UsuarioOrmEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    contraseña: string;
    
    @Column({
        type: 'enum',
        enum: EstadoUsuario,
        default: EstadoUsuario.ACTIVO
    })
    estado: EstadoUsuario;

    @Column({name: 'rol_id'}) // Columna en la tabla 
    rolId: string

    //Relacion: Muchos usuarios pueden tener un rol
    @ManyToOne(() => RolOrmEntity, rol => rol.usuarios, { eager: true })
    @JoinColumn({name: 'rol_id'})
    rol: RolOrmEntity;
}

//recuerda que lña anotracion @ManytoOne es la que lleva la fk en la bd
//y que el segundo parametro es una funcion que recibe la entidad a la que se relaciona
//y retorna la propiedad de esa entidad que tiene la relacion inversa
//en este caso, en la entidad RolOrmEntity, la propiedad usuarios tiene la relacion inversa
//es decir, un rol puede tener muchos usuarios