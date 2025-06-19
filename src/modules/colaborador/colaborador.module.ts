import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ColaboradorOrmEntity } from "./infrastructure/database/colaborador.orm-entity";
import { ColaboradorRepositoryImpl } from "./infrastructure/repositories/colaborador.repository.impl";
import { COLABORADOR_REPOSITORY } from "./colaborador.repository.token";
import { UsuarioModule } from "../usuario/usuario.module";
import { ColaboradorController } from "./infrastructure/colaborador.controller";
import { CrearColaboradorUseCase } from "./application/use-cases/crear-colaborador.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([ColaboradorOrmEntity]), UsuarioModule],
    controllers: [ColaboradorController],
    providers: [CrearColaboradorUseCase,
        {
            provide: CrearColaboradorUseCase,
            useClass: CrearColaboradorUseCase
        },
        {
              provide: COLABORADOR_REPOSITORY,
              useClass: ColaboradorRepositoryImpl, // ← Asegúrate de usar tu implementación
            },
    ],
    exports: [ColaboradorModule, COLABORADOR_REPOSITORY],
})
export class ColaboradorModule {

}
