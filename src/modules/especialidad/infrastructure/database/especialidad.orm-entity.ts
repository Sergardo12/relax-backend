import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadoEspecialidad } from "../../domain/enums/especialidad.enums";
import { ColaboradorOrmEntity } from "../../../colaborador/infrastructure/database/colaborador.orm-entity";
import { ServicioOrmEntity } from "src/modules/servicio/infrastructure/database/servicio.orm-entity";

@Entity('especialidad')
export class EspecialidadOrmEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column({type: 'enum', enum: EstadoEspecialidad, default: EstadoEspecialidad.ACTIVO})
    estado: EstadoEspecialidad;

    @OneToMany(() => ColaboradorOrmEntity, colaborador => colaborador.especialidad)
    colaboradores: ColaboradorOrmEntity[]

    @OneToMany(() => ServicioOrmEntity, servicio => servicio.especialidad)
    servicios: ServicioOrmEntity[]

}