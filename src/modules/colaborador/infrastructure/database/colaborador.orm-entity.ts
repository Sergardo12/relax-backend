import { EspecialidadOrmEntity } from "src/modules/especialidad/infrastructure/database/especialidad.orm-entity";
import { PagoColaboradorOrmEntity } from "src/modules/pago-colaborador/infrastructure/database/pago-colaborador.orm-entity";
import { UsuarioOrmEntity } from "src/modules/usuario/infrastructure/database/usuario-entity.orm";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity('colaborador')
export class ColaboradorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsuarioOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioOrmEntity;

  @ManyToOne(() => EspecialidadOrmEntity, { eager: true })
  @JoinColumn({ name: 'idEspecialidad' })
  especialidad: EspecialidadOrmEntity;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ type: 'varchar', length: 8 })
  dni: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'date' })
  fechaContratacion: Date;

  @Column({ type: 'varchar', length: 9 })
  telefono: string;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
