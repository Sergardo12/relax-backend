import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorOrmEntity } from './infrastructure/database/colaborador.orm-entity';
import { EspecialidadModule } from '../especialidad/especialidad.module';
import { ColaboradorController } from './presentation/colaborador.controller';
import { COLABORADOR_REPOSITORY } from './infrastructure/colaborador.repository.token';
import { ColaboradorRepositoryImpl } from './infrastructure/repositories/colaborador.repository.impl';
import { ColaboradorService } from './application/services/colaborador.service';
import { CrearColaboradorUseCase } from './application/use-cases/crear-colaborador.use-case';
import { ListarColaboradoresUseCase } from './application/use-cases/listar-colaboradores.use-case';
import { ObtenerColaboradorPorIdUseCase } from './application/use-cases/obtener-colaborador-por-id.use-case';
import { ActualizarColaboradorUseCase } from './application/use-cases/actualizar-colaborador.use-case';
import { EliminarColaboradorUseCase } from './application/use-cases/eliminar-colaborador.use-case';
import { UsuarioModule } from '../usuario/usuario.module';
import { ObtenerPerfilColaboradorUseCase } from './application/use-cases/obtener-perfil-colaborador.use-case';


@Module({
  imports: [
    TypeOrmModule.forFeature([ColaboradorOrmEntity]),
    EspecialidadModule,
    UsuarioModule,
  ],
  controllers: [ColaboradorController],
  providers: [
    {
      provide: COLABORADOR_REPOSITORY,
      useClass: ColaboradorRepositoryImpl,
    },
    ColaboradorService,
    CrearColaboradorUseCase,
    ListarColaboradoresUseCase,
    ObtenerColaboradorPorIdUseCase,
    ActualizarColaboradorUseCase,
    EliminarColaboradorUseCase,
    ObtenerPerfilColaboradorUseCase
  ],
  exports: [COLABORADOR_REPOSITORY],
})
export class ColaboradorModule {}
