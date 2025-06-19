import { CitaOrmEntity } from "../../../cita/infrastructure/database/cita.orm-entity";
import { UsuarioOrmEntity } from "../../../usuario/infrastructure/database/usuario.orm-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('colaborador')
export class ColaboradorOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsuarioOrmEntity, { eager: true }) // eager para traer automaticamente el usuario
  @JoinColumn()
  usuario: UsuarioOrmEntity;

  @Column()
  dni: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  telefono: string;

  @Column()
  fecha_contratacion: Date;

  @Column({ default: true })
  estadoColaborador: boolean;
  
  
  @OneToMany(() => CitaOrmEntity, (cita) => cita.colaborador)
  citas: CitaOrmEntity[];
}
