import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroGastoOrmEntity } from './infrastructure/database/registro-gasto.orm-entity';
import { DetalleGastoOrmEntity } from './infrastructure/database/detalle-gasto.orm-entity';
import { RegistroGastoController } from './presentation/registro-gasto.controller';
import { REGISTRO_GASTO_REPOSITORY } from './infrastructure/registro-gasto.repository.token';
import { DETALLE_GASTO_REPOSITORY } from './infrastructure/detalle-gasto.repository.token';
import { RegistroGastoRepositoryImpl } from './infrastructure/repositories/registro-gasto.repository.impl';
import { DetalleGastoRepositoryImpl } from './infrastructure/repositories/detalle-gasto.repository.impl';
import { ProveedorInsumoModule } from '../proveedor-insumo/proveedor-insumo.module';
import { CrearRegistroGastoUseCase } from './application/uses-cases/crear-registro.use-case';
import { ListarGastosUseCase } from './application/uses-cases/listar-gastos.use-case';
import { ObtenerGastoConDetallesUseCase } from './application/uses-cases/obtener-gasto-con-detalles.use-case';
import { ListarGastosPorCategoriaUseCase } from './application/uses-cases/listar-gastos-por-categoria.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistroGastoOrmEntity,
      DetalleGastoOrmEntity,
    ]),
    ProveedorInsumoModule, 
  ],
  controllers: [RegistroGastoController],
  providers: [
    {
      provide: REGISTRO_GASTO_REPOSITORY,
      useClass: RegistroGastoRepositoryImpl,
    },
    {
      provide: DETALLE_GASTO_REPOSITORY,
      useClass: DetalleGastoRepositoryImpl,
    },
    CrearRegistroGastoUseCase,
    ListarGastosUseCase,
    ObtenerGastoConDetallesUseCase,
    ListarGastosPorCategoriaUseCase,
  ],
  exports: [REGISTRO_GASTO_REPOSITORY, DETALLE_GASTO_REPOSITORY],
})
export class RegistroGastoModule {}