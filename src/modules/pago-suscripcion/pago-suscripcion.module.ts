import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PagoSuscripcionOrmEntity } from "./infrastructure/database/pago-suscripcion.orm-entity";
import { SuscripcionModule } from "../suscripcion/suscripcion.module";
import { ConfigModule } from "@nestjs/config";
import { PagoSuscripcionController } from "./presentation/pago-suscripcion.controller";
import { PAGO_SUSCRIPCION_REPOSITORY_TOKEN } from "./infrastructure/pago-suscripcion.repository.token";
import { PagoSuscripcionRepositoryImpl } from "./infrastructure/repositories/pago-suscripcion.repository.impl";
import { PagoSuscripcionService } from "./application/services/pago-suscripcion.service";
import { PagarSuscripcionTarjetaUseCase } from "./application/uses-cases/pagar-suscripcion-tarjeta.use-case";
import { PagarSuscripcionEfectivoUseCase } from "./application/uses-cases/pagar-suscripcion-efectivo.use-case";
import { PagarSuscripcionYapeUseCase } from "./application/uses-cases/pagar-suscripcion-yape.use-case";
import { ListarPagosPorSuscripcionUseCase } from "./application/uses-cases/listar-pagos-por-suscripcion.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([PagoSuscripcionOrmEntity]),
    ConfigModule,
    SuscripcionModule],
    controllers: [PagoSuscripcionController],
    providers: [
        {
            provide: PAGO_SUSCRIPCION_REPOSITORY_TOKEN,
            useClass: PagoSuscripcionRepositoryImpl,
        },
        PagoSuscripcionService,
        PagarSuscripcionTarjetaUseCase,
        PagarSuscripcionEfectivoUseCase,
        PagarSuscripcionYapeUseCase,
        ListarPagosPorSuscripcionUseCase,
    ],
    exports: [PAGO_SUSCRIPCION_REPOSITORY_TOKEN, PagoSuscripcionService],
})
export class PagoSuscripcionModule {}