import { ColaboradorOrmEntity } from "src/modules/colaborador/infrastructure/database/colaborador.orm-entity";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export class PagoColaboradorOrmEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // @ManyToOne(() => ColaboradorOrmEntity, colaborador => colaborador.pagos)
    // @JoinColumn({ name: 'idColaborador' })
    // coladorador: ColaboradorOrmEntity

    @Column()
    monto: number;

    @Column()
    fecha: Date;

    @Column()
    observaciones: string;

    @Column() // mejorar con enum
    metodoPago: string

    @Column() // mejorar con enum
    estado: string ;
}