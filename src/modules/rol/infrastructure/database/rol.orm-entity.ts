import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EstadoRol } from "../../domain/enums/rol.enum";
import { UsuarioOrmEntity } from "../../../usuario/infrastructure/database/usuario-entity.orm";

@Entity('rol')
export class RolOrmEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({
      type: 'enum',
      enum: EstadoRol,
      default: EstadoRol.ACTIVO
    })
    estado: EstadoRol;

    @OneToMany(() => UsuarioOrmEntity, usuario => usuario.rolId)
    usuarios: UsuarioOrmEntity[];
  }