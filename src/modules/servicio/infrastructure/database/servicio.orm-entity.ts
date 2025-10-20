import { EspecialidadOrmEntity } from "src/modules/especialidad/infrastructure/database/especialidad.orm-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadoServicio } from "../../domain/enum/servicio.enum";

@Entity('servicio')
export class ServicioOrmEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => EspecialidadOrmEntity, especialidad => especialidad.servicios)
    @JoinColumn({name: 'especilidad_id'})
    especialidad: EspecialidadOrmEntity

    @Column({length: 100})
    nombre: string

    @Column({length: 255})
    descripcion: string

    @Column('decimal' ,{ precision: 10, scale: 2})
    precio: number

    @Column()
    duracion: number

    @Column({type: 'enum', enum: EstadoServicio, default: EstadoServicio.ACTIVO})
    estado: EstadoServicio


}