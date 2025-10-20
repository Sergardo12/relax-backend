import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuscripcionOrmEntity } from "./infrastructure/database/suscripcion.orm-entity";
import { PacienteModule } from "../paciente/paciente.module";
import { MembresiaModule } from "../membresia/membresia.module";
import { BeneficioMembresianModule } from "../beneficio-membresia/beneficio-membresia.module";
import { ConsumoBeneficioModule } from "../consumo-beneficio/consumo-beneficio.module";
import { SuscripcionController } from "./presentation/suscripcion.controller";
import { SUSCRIPCION_REPOSITORY_TOKEN } from "./infrastructure/suscripcion.repository.token";
import { SuscripcionRepositoryImpl } from "./infrastructure/repositories/suscripcion.repository.impl";
import { SuscripcionService } from "./application/services/suscripcion.service";
import { CrearSuscripcionUseCase } from "./application/use-cases/crear-suscripcion.use-case";
import { ListarSuscripcionesPorPacienteUseCase } from "./application/use-cases/listar-suscripciones-por-paciente.use-case";
import { CancelarSuscripcionUseCase } from "./application/use-cases/cancelar-suscripcion.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([SuscripcionOrmEntity]), 
    PacienteModule,
    MembresiaModule,
    BeneficioMembresianModule,
    forwardRef(()=>ConsumoBeneficioModule) ],
    controllers: [SuscripcionController],
    providers: [
        {
            provide: SUSCRIPCION_REPOSITORY_TOKEN,
            useClass: SuscripcionRepositoryImpl
        },
        SuscripcionService,
        CrearSuscripcionUseCase,
        ListarSuscripcionesPorPacienteUseCase,
        CancelarSuscripcionUseCase
    ],
    exports: [SUSCRIPCION_REPOSITORY_TOKEN, SuscripcionService],
})
export class SuscripcionModule {}