import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaProductoOrmEntity } from './infrastructure/database/venta-producto.orm-entity';
import { DetalleVentaProductoOrmEntity } from './infrastructure/database/detalle-venta-producto.orm-entity';
import { VentaProductoController } from './presentation/venta-producto.controller';
import { VENTA_PRODUCTO_REPOSITORY } from './infrastructure/venta-producto.repository.token';
import { DETALLE_VENTA_PRODUCTO_REPOSITORY } from './infrastructure/detalle-venta-producto.repository.token';
import { VentaProductoRepositoryImpl } from './infrastructure/repositories/venta-producto.repository.impl';
import { DetalleVentaProductoRepositoryImpl } from './infrastructure/repositories/detalle-venta-producto.repository.impl';

import { ProductoModule } from '../producto/producto.module';
import { CrearVentaProductoUseCase } from './application/uses-cases/crear-venta-producto.use-case';
import { ListarVentasUseCase } from './application/uses-cases/listar-ventas.use-case';
import { ObtenerVentaConDetallesUseCase } from './application/uses-cases/obtener-ventas-con-detalles.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VentaProductoOrmEntity,
      DetalleVentaProductoOrmEntity,
    ]),
    ProductoModule,
  ],
  controllers: [VentaProductoController],
  providers: [
    {
      provide: VENTA_PRODUCTO_REPOSITORY,
      useClass: VentaProductoRepositoryImpl,
    },
    {
      provide: DETALLE_VENTA_PRODUCTO_REPOSITORY,
      useClass: DetalleVentaProductoRepositoryImpl,
    },
    CrearVentaProductoUseCase,
    ListarVentasUseCase,
    ObtenerVentaConDetallesUseCase,
  ],
  exports: [VENTA_PRODUCTO_REPOSITORY, DETALLE_VENTA_PRODUCTO_REPOSITORY],
})
export class VentaProductoModule {}