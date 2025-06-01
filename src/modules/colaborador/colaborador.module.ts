import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ColaboradorOrmEntity } from "./infrastructure/database/colaborador.orm-entity";
import { ColaboradorRepositoryImpl } from "./infrastructure/repositories/colaborador.repository.impl";
import { COLABORADOR_REPOSITORY } from "./colaborador.repository.token";

@Module({
    imports: [TypeOrmModule.forFeature([ColaboradorOrmEntity])],
    providers: [
        {
            provide: COLABORADOR_REPOSITORY,
            useClass: require('./infrastructure/repositories/colaborador.repository.impl').ColaboradorRepositoryImpl,
        },
    ],
    exports: [ColaboradorModule],
})
export class ColaboradorModule {

}
