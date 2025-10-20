import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PagoColaboradorOrmEntity } from "./infrastructure/database/pago-colaborador.orm-entity";
import { ColaboradorModule } from "../colaborador/colaborador.module";

@Module({
    imports: [TypeOrmModule.forFeature([PagoColaboradorOrmEntity]),
    ColaboradorModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class PagoColaboradorModule {}