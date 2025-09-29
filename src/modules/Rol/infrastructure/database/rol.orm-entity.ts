import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EstadoRol } from "../../domain/enums/rol.enum";
import { UsuarioOrmEntity } from "src/modules/Usuario/infrastructure/database/usuario-entity.orm";

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

    //Relacion: Un rol puede tener muchos usuarios
    //“En la tabla usuario hay una columna (rolId) que hace referencia a rol. Dame todos los usuarios que tengan este rol”.

    @OneToMany(() => UsuarioOrmEntity, usuario => usuario.rolId)
    //"Cuando consulte un rol, también puedo traer un arreglo ([]) con todos los usuarios que están asociados a este rol".
    usuarios: UsuarioOrmEntity[];
  }