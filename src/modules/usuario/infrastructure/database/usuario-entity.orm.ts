import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadoUsuario } from "../../domain/enums/usuario.enum";
import { RolOrmEntity } from "../../../rol/infrastructure/database/rol.orm-entity";

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

    @Column({ type: 'boolean', default: false }) // ⭐ AGREGAR ESTA LÍNEA
    perfilCompleto: boolean;

    @Column({name: 'rol_id'}) // Columna en la tabla 
    rolId: string

    //Relacion: Muchos usuarios pueden tener un rol
    @ManyToOne(() => RolOrmEntity, rol => rol.usuarios, { eager: true, cascade: ['insert', 'update'] })
    @JoinColumn({name: 'rol_id'})
    rol: RolOrmEntity;

    
}

