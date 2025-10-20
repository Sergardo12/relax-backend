import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PacienteOrmEntity } from "./infrastructure/database/paciente.orm-entity";
import { UsuarioModule } from "../../modules/usuario/usuario.module";
import { PacienteController } from "./presentation/paciente.controller";
import { CompletarDatosPacienteUseCase } from "./application/uses-cases/completarDatosPaciente.use-case";
import { PACIENTE_REPOSITORY } from "./infrastructure/paciente.repository.token";
import { PacienteRepositoryImpl } from "./infrastructure/repositories/paciente.repository.impl";
import { ObtenerPerfilPaciente } from "./application/uses-cases/obtener-perfil-paciente-use-case";


@Module({
    imports: [ TypeOrmModule.forFeature([PacienteOrmEntity]), UsuarioModule ],
    controllers: [PacienteController],
    providers: [
        CompletarDatosPacienteUseCase,
        ObtenerPerfilPaciente,
        {
            provide: PACIENTE_REPOSITORY,
            useClass: PacienteRepositoryImpl
        }
    ],
    exports: [PACIENTE_REPOSITORY],
})
export class PacienteModule {}