import { SuscripcionOrmEntity } from "src/modules/suscripcion/infrastructure/database/suscripcion.orm-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EstadoPagoSuscripcion, MetodoPagoSuscripcion } from "../../domain/enum/pago-suscripcion.enum";

@Entity('pago_suscripcion')
export class PagoSuscripcionOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SuscripcionOrmEntity, suscripcion => suscripcion.pagos, {eager: true,  onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idSuscripcion' })
    suscripcion: SuscripcionOrmEntity

    @Column({ type: 'varchar', length: 255, nullable: true })
    culqiChargeId?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    culqiToken?: string;

    @Column({ type: 'timestamp' })
    fechaPago: Date;

    @Column({
    type: 'enum',
    enum: MetodoPagoSuscripcion,
    })
    metodoPago: MetodoPagoSuscripcion;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    montoTotal: number;

    @Column({ type: 'varchar', length: 3, default: 'PEN' })
    moneda: string;

    @Column({
    type: 'enum',
    enum: EstadoPagoSuscripcion,
    default: EstadoPagoSuscripcion.PENDIENTE,
    })
    estado: EstadoPagoSuscripcion;

    @Column({ type: 'json', nullable: true })
    culqiResponse?: any;

    @Column({ type: 'text', nullable: true })
    mensajeError?: string;

    @Column({ type: 'varchar', length: 500, nullable: true }) // ⭐ NUEVO
    qrUrl?: string;

    @Column({ type: 'varchar', length: 500, nullable: true }) // ⭐ NUEVO
    paymentUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}