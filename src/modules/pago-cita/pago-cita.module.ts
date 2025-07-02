import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PagoCitaOrmEntity } from "./infrastructure/database/pago-cita.orm-entity";
import { CitaModule } from "../cita/cita.module";
import { PagoCitaController } from "./infrastructure/pago-cita.controller";
import { PAGO_CITA_REPOSITORY } from "./pago-cita.repository.token";
import { PagoCitaRepositoryImpl } from "./infrastructure/repository/pago-cita.repository.impl";

@Module({
    imports: [
        TypeOrmModule.forFeature([PagoCitaOrmEntity]), CitaModule
    ],
    controllers: [PagoCitaController],
    providers: [
        {
            provide: PAGO_CITA_REPOSITORY,
            useClass: PagoCitaRepositoryImpl
        }
    ],
    exports: [PAGO_CITA_REPOSITORY]
})
export class PagoCitaModule{}