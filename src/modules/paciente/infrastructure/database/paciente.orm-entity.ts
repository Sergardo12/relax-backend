import { SuscripcionOrmEntity } from "src/modules/suscripcion/infrastructure/database/suscripcion.orm-entity";
import { UsuarioOrmEntity } from "src/modules/usuario/infrastructure/database/usuario-entity.orm";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('paciente')
export class PacienteOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relacion: Un paciente tiene un usuario
    @OneToOne(() => UsuarioOrmEntity, { eager: true, onDelete : 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' }) // Columna en la tabla paciente que referencia a usuario
    usuario: UsuarioOrmEntity;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ unique: true, nullable: true })
    dni: string

    @Column({ type: 'date', nullable: true })
    fechaNacimiento: Date;

    @Column({ nullable: true })
    telefono: string;

    // @OneToMany(() => SuscripcionOrmEntity, suscripcion => suscripcion.paciente)
    // suscripciones: SuscripcionOrmEntity[];

}
