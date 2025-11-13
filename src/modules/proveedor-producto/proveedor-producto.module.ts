import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorProductoOrmEntity } from './infrastructure/database/proveedor-producto.orm-entity';
import { ProveedorProductoController } from './presentation/proveedor-producto.controller';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from './infrastructure/proveedor-producto.repository.token';
import { ProveedorProductoRepositoryImpl } from './infrastructure/repositories/proveedor-producto.repository.impl';
import { CrearProveedorProductoUseCase } from './application/uses-cases/crear-producto.use-case';
import { ListarProveedoresProductoUseCase } from './application/uses-cases/listar-proveedores-producto.use-case';
import { ObtenerProveedorProductoUseCase } from './application/uses-cases/obtener-proveedor-producto.use-case';
import { ActualizarProveedorProductoUseCase } from './application/uses-cases/actualizar-proveedor-producto.use-case';
import { EliminarProveedorProductoUseCase } from './application/uses-cases/eliminar-proveedor-producto.use-case';
import { ListarProveedoresProductoActivosUseCase } from './application/uses-cases/listar-proveedores-producto-activos.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ProveedorProductoOrmEntity])],
  controllers: [ProveedorProductoController],
  providers: [
    {
      provide: PROVEEDOR_PRODUCTO_REPOSITORY,
      useClass: ProveedorProductoRepositoryImpl,
    },
    CrearProveedorProductoUseCase,
    ListarProveedoresProductoUseCase,
    ObtenerProveedorProductoUseCase,
    ActualizarProveedorProductoUseCase,
    EliminarProveedorProductoUseCase,
    ListarProveedoresProductoActivosUseCase,
  ],
  exports: [PROVEEDOR_PRODUCTO_REPOSITORY],
})
export class ProveedorProductoModule {}