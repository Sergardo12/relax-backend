import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembresiaOrmEntity } from "./infrastructure/database/membresia.orm-entity";
import { MembresiaController } from "./presentation/membresia.controller";
import { MEMBRESIA_REPOSITORY_TOKEN } from "./infrastructure/membresia.repository.token";
import { MembresiaRepositoryImpl } from "./infrastructure/repositories/membresia.repository.impl";
import { CrearMembresiaUseCase } from "./application/uses-cases/crear-membresia.use-case";
import { ListarMembresiasActivasUseCase } from "./application/uses-cases/listar-membresias.use-case";
import { ObtenerMembresiaUseCase } from "./application/uses-cases/obtener-membresia.use-case";
import { ActualizarMembresiaUseCase } from "./application/uses-cases/actualizar-membresia.use-case";
import { DesactivarMembresiaUseCase } from "./application/uses-cases/desactivar-membresia.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([MembresiaOrmEntity])],
    controllers: [MembresiaController],
    providers: [
        {
            provide: MEMBRESIA_REPOSITORY_TOKEN,
            useClass: MembresiaRepositoryImpl
        },
        CrearMembresiaUseCase,
        ListarMembresiasActivasUseCase,
        ObtenerMembresiaUseCase,
        ActualizarMembresiaUseCase,
        DesactivarMembresiaUseCase

    ],
    exports: [MEMBRESIA_REPOSITORY_TOKEN],
})
export class MembresiaModule {}