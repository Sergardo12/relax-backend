import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Result } from 'src/common/types/result';
import { CompraProducto } from '../../domain/entities/compra-producto.entity';
import { DetalleCompraProducto } from '../../domain/entities/detalle-compra-producto.entity';
import { CompraProductoRepository } from '../../domain/repositories/compra-producto.repository';
import { COMPRA_PRODUCTO_REPOSITORY } from '../../infrastructure/compra-producto.repository.token';
import { ProductoRepository } from '../../../producto/domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../../producto/infrastructure/producto.repository.token';
import { CrearCompraProductoDto } from '../../infrastructure/dto/crear-compra-producto.dto';
import { CompraProductoOrmEntity } from '../../infrastructure/database/compra-producto.orm-entity';
import { DetalleCompraProductoOrmEntity } from '../../infrastructure/database/detalle-compra-producto.orm-entity';
import { CompraProductoMapper } from '../../infrastructure/mapper/compra-producto.mapper';
import { DetalleCompraProductoMapper } from '../../infrastructure/mapper/detalle-compra-producto.mapper';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from 'src/modules/proveedor-producto/infrastructure/proveedor-producto.repository.token';
import { ProveedorProductoRepository } from 'src/modules/proveedor-producto/domain/repositories/proveedor-producto.repository';

@Injectable()
export class CrearCompraProductoUseCase {
  constructor(
    @Inject(COMPRA_PRODUCTO_REPOSITORY)
    private readonly compraRepository: CompraProductoRepository,
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
    @InjectRepository(CompraProductoOrmEntity)
    private readonly compraOrmRepository: Repository<CompraProductoOrmEntity>,
    @InjectRepository(DetalleCompraProductoOrmEntity)
    private readonly detalleOrmRepository: Repository<DetalleCompraProductoOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CrearCompraProductoDto): Promise<Result<CompraProducto>> {
    // Usar transacción para asegurar atomicidad
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar que el proveedor existe
      const proveedorResult = await this.proveedorRepository.findById(dto.idProveedor);
      if (!proveedorResult.ok || !proveedorResult.value) {
        await queryRunner.rollbackTransaction();
        return Result.failure('Proveedor no encontrado');
      }
      const proveedor = proveedorResult.value;

      // 2. Validar que todos los productos existen y calcular total
      let total = 0;
      const detallesEntities: DetalleCompraProducto[] = [];

      for (const detalleDto of dto.detalles) {
        const productoResult = await this.productoRepository.findById(detalleDto.idProducto);
        
        if (!productoResult.ok || !productoResult.value) {
          await queryRunner.rollbackTransaction();
          return Result.failure(`Producto ${detalleDto.idProducto} no encontrado`);
        }

        const producto = productoResult.value;

        // Crear entidad de detalle
        const detalle = new DetalleCompraProducto({
          producto: producto,
          cantidad: detalleDto.cantidad,
          precioCompra: detalleDto.precioCompra,
        });

        detallesEntities.push(detalle);
        total += detalle.getSubtotal();
      }

        const fecha = new Date(dto.fecha + 'T12:00:00')

      // 3. Crear la compra (cabecera)
      const compra = new CompraProducto({
        proveedor: proveedor,
        fecha: fecha,
        tipoComprobante: dto.tipoComprobante,
        numeroComprobante: dto.numeroComprobante,
        total: total,
        observaciones: dto.observaciones,
      });

      // 4. Guardar la compra
      const compraOrm = CompraProductoMapper.toOrmEntity(compra);
      const compraSaved = await queryRunner.manager.save(CompraProductoOrmEntity, compraOrm);

      console.log('✅ Compra creada:', compraSaved.id);

      // 5. Guardar los detalles y AUMENTAR STOCK
      for (const detalle of detallesEntities) {
        // Guardar detalle
        const detalleOrm = DetalleCompraProductoMapper.toOrmEntity(detalle, compraSaved.id);
        await queryRunner.manager.save(DetalleCompraProductoOrmEntity, detalleOrm);

        // ⭐⭐⭐ AUMENTAR STOCK DEL PRODUCTO ⭐⭐⭐
        const producto = detalle.getProducto();
        const cantidadAntes = producto.getStock();
        
        producto.aumentarStock(detalle.getCantidad());
        
        const cantidadDespues = producto.getStock();

        // Actualizar producto en BD
        const updateResult = await this.productoRepository.update(
          producto.getId(),
          producto,
        );

        if (!updateResult.ok) {
          await queryRunner.rollbackTransaction();
          return Result.failure('Error al actualizar stock del producto');
        }

        console.log(
          `📦 Stock actualizado - Producto: ${producto.getNombre()} | Antes: ${cantidadAntes} | Después: ${cantidadDespues} (+${detalle.getCantidad()})`,
        );
      }

      // 6. Commit de la transacción
      await queryRunner.commitTransaction();

      // 7. Recargar la compra con todas las relaciones
      const compraCompleta = await this.compraOrmRepository.findOne({
        where: { id: compraSaved.id },
        relations: ['proveedor', 'detalles', 'detalles.producto'],
      });

      if (!compraCompleta) {
        return Result.failure('Error al recargar la compra');
      }

      console.log('✅ Compra completada exitosamente');

      return Result.success(CompraProductoMapper.toDomain(compraCompleta));
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      console.error('❌ Error en CrearCompraProductoUseCase:', error);
      return Result.failure('Error al crear la compra', error);
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }
}