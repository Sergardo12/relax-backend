import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConsumoBeneficioOrmEntity } from "./infrastructure/database/consumo-beneficio.orm-entity";
import { ConsumoBeneficioController } from "./presentation/consumo-beneficio.controller";
import { CONSUMO_BENEFICIO_REPOSITORY_TOKEN } from "./infrastructure/consumo-beneficio.repository.token";
import { ConsumoBeneficioRepositoryImpl } from "./infrastructure/repositories/consumo-beneficio.repository.impl";
import { ConsumoBeneficioService } from "./application/services/consumo-beneficio.service";
import { ListarConsumosPorSuscripcionUseCase } from "./application/use-cases/listar-consumos-por-suscripcion.use-case";
import { ObtenerConsumoUseCase } from "./application/use-cases/obtener-consumo.use-case";
import { SuscripcionModule } from "../suscripcion/suscripcion.module";

@Module({
    imports: [TypeOrmModule.forFeature([ConsumoBeneficioOrmEntity]),
    forwardRef(() => SuscripcionModule) ],
    controllers: [ConsumoBeneficioController],
    providers: [
        {
            provide: CONSUMO_BENEFICIO_REPOSITORY_TOKEN,
            useClass: ConsumoBeneficioRepositoryImpl
        },
        ConsumoBeneficioService,
        ListarConsumosPorSuscripcionUseCase,
        ObtenerConsumoUseCase
    ],
    exports: [CONSUMO_BENEFICIO_REPOSITORY_TOKEN, ConsumoBeneficioService],
})
export class ConsumoBeneficioModule {}