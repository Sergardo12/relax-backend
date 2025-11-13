import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoOrmEntity } from './infrastructure/database/producto.orm-entity';
import { ProductoController } from './presentation/producto.controller';
import { PRODUCTO_REPOSITORY } from './infrastructure/producto.repository.token';
import { ProductoService } from './application/services/producto.service';
import { ProductoRepositoryImpl } from './infrastructure/repositories/producto.repository.impl';
import { CrearProductoUseCase } from './application/uses-cases/crear-producto.use-case';
import { ListarProductosUseCase } from './application/uses-cases/listar-productos.use-case';
import { ObtenerProductoUseCase } from './application/uses-cases/obtener-producto.use-case';
import { ActualizarProductoUseCase } from './application/uses-cases/actualizar-producto.use-case';
import { EliminarProductoUseCase } from './application/uses-cases/eliminar-producto.use-case';
import { ListarProductosStockBajoUseCase } from './application/uses-cases/listar-productos-stock-bajo.use-case';
import { AjustarStockProductoUseCase } from './application/uses-cases/ajustar-stock-producto.use-case';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoOrmEntity])],
  controllers: [ProductoController],
  providers: [
    {
      provide: PRODUCTO_REPOSITORY,
      useClass: ProductoRepositoryImpl,
    },
    ProductoService,
    CrearProductoUseCase,
    ListarProductosUseCase,
    ObtenerProductoUseCase,
    ActualizarProductoUseCase,
    EliminarProductoUseCase,
    ListarProductosStockBajoUseCase,
    AjustarStockProductoUseCase
  ],
  exports: [PRODUCTO_REPOSITORY, ProductoService],
})
export class ProductoModule {}