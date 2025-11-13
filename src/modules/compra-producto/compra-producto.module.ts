import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraProductoOrmEntity } from './infrastructure/database/compra-producto.orm-entity';
import { DetalleCompraProductoOrmEntity } from './infrastructure/database/detalle-compra-producto.orm-entity';
import { CompraProductoController } from './presentation/compra-producto.controller';
import { COMPRA_PRODUCTO_REPOSITORY } from './infrastructure/compra-producto.repository.token';
import { DETALLE_COMPRA_PRODUCTO_REPOSITORY } from './infrastructure/detalle-compra-producto.repository.token';
import { CompraProductoRepositoryImpl } from './infrastructure/repositories/compra-producto.repository.impl';
import { DetalleCompraProductoRepositoryImpl } from './infrastructure/repositories/detalle-compra-producto.repository.impl';

import { ProductoModule } from '../producto/producto.module';
import { ProveedorProductoModule } from '../proveedor-producto/proveedor-producto.module';
import { CrearCompraProductoUseCase } from './application/uses-cases/crear-compra-producto.use-case';
import { ListarComprasUseCase } from './application/uses-cases/listar-compras.use-case';
import { ObtenerCompraConDetallesUseCase } from './application/uses-cases/obtener-compra-con-detalles.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompraProductoOrmEntity,
      DetalleCompraProductoOrmEntity,
    ]),
    ProductoModule, 
    ProveedorProductoModule, 
  ],
  controllers: [CompraProductoController],
  providers: [
    {
      provide: COMPRA_PRODUCTO_REPOSITORY,
      useClass: CompraProductoRepositoryImpl,
    },
    {
      provide: DETALLE_COMPRA_PRODUCTO_REPOSITORY,
      useClass: DetalleCompraProductoRepositoryImpl,
    },
    CrearCompraProductoUseCase,
    ListarComprasUseCase,
    ObtenerCompraConDetallesUseCase,
  ],
  exports: [COMPRA_PRODUCTO_REPOSITORY, DETALLE_COMPRA_PRODUCTO_REPOSITORY],
})
export class CompraProductoModule {}