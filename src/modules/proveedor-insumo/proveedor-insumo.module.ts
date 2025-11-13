import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorInsumoOrmEntity } from './infrastructure/database/proveedor-insumo.orm-entity';
import { ProveedorInsumoController } from './presentation/proveedor-insumo.controller';
import { PROVEEDOR_INSUMO_REPOSITORY } from './infrastructure/proveedor-insumo.repository.token';
import { ProveedorInsumoRepositoryImpl } from './infrastructure/repositories/proveedor-insumo.repository.impl';
import { CrearProveedorInsumoUseCase } from './application/uses-cases/crear-proveedor-insumo.use-case';
import { ListarProveedoresInsumoUseCase } from './application/uses-cases/listar-proveedores-insumo.use-case';
import { ObtenerProveedorInsumoUseCase } from './application/uses-cases/obtener-proveedor-insumo.use-case';
import { ActualizarProveedorInsumoUseCase } from './application/uses-cases/actualizar-proveedor-insumo.use-case';
import { EliminarProveedorInsumoUseCase } from './application/uses-cases/eliminar-proveedor-insumo.use-case';


@Module({
  imports: [TypeOrmModule.forFeature([ProveedorInsumoOrmEntity])],
  controllers: [ProveedorInsumoController],
  providers: [
    {
      provide: PROVEEDOR_INSUMO_REPOSITORY,
      useClass: ProveedorInsumoRepositoryImpl,
    },
    CrearProveedorInsumoUseCase,
    ListarProveedoresInsumoUseCase,
    ObtenerProveedorInsumoUseCase,
    ActualizarProveedorInsumoUseCase,
    EliminarProveedorInsumoUseCase,
  ],
  exports: [PROVEEDOR_INSUMO_REPOSITORY],
})
export class ProveedorInsumoModule {}