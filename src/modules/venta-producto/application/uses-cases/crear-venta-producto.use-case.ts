import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Result } from 'src/common/types/result';
import { VentaProducto } from '../../domain/entities/venta-producto.entity';
import { DetalleVentaProducto } from '../../domain/entities/detalle-venta-producto.entity';
import { ProductoRepository } from '../../../producto/domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../../producto/infrastructure/producto.repository.token';
import { CrearVentaProductoDto } from '../../infrastructure/dto/crear-venta-producto.dto';
import { VentaProductoOrmEntity } from '../../infrastructure/database/venta-producto.orm-entity';
import { DetalleVentaProductoOrmEntity } from '../../infrastructure/database/detalle-venta-producto.orm-entity';
import { VentaProductoMapper } from '../../infrastructure/mapper/venta-producto.mapper';
import { DetalleVentaProductoMapper } from '../../infrastructure/mapper/detalle-venta-producto.mapper';
import { TipoComprobanteVenta } from '../../domain/enums/venta-producto.enum';

@Injectable()
export class CrearVentaProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepository,
    @InjectRepository(VentaProductoOrmEntity)
    private readonly ventaOrmRepository: Repository<VentaProductoOrmEntity>,
    @InjectRepository(DetalleVentaProductoOrmEntity)
    private readonly detalleOrmRepository: Repository<DetalleVentaProductoOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CrearVentaProductoDto): Promise<Result<VentaProducto>> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 0. ⭐ GENERAR NÚMERO DE COMPROBANTE AUTOMÁTICAMENTE
    const prefijo = dto.tipoComprobante === TipoComprobanteVenta.BOLETA ? 'B001' : 'F001';
    
    // Buscar el último comprobante del mismo tipo
    const ultimaVenta = await this.ventaOrmRepository.findOne({
      where: { tipoComprobante: dto.tipoComprobante },
      order: { createdAt: 'DESC' },
    });

    let numeroComprobante: string;
    if (ultimaVenta) {
      // Extraer número: "B001-00005" → 5
      const partes = ultimaVenta.numeroComprobante.split('-');
      const numeroActual = parseInt(partes[1]);
      const nuevoNumero = numeroActual + 1;
      numeroComprobante = `${prefijo}-${nuevoNumero.toString().padStart(8, '0')}`;
    } else {
      // Primera venta de este tipo
      numeroComprobante = `${prefijo}-00000001`;
    }

    console.log(`📄 Generando comprobante: ${numeroComprobante}`);

    // 1. Validar productos y stock disponible
    let subtotal = 0;
    const detallesEntities: DetalleVentaProducto[] = [];

    for (const detalleDto of dto.detalles) {
      const productoResult = await this.productoRepository.findById(detalleDto.idProducto);

      if (!productoResult.ok || !productoResult.value) {
        await queryRunner.rollbackTransaction();
        return Result.failure(`Producto ${detalleDto.idProducto} no encontrado`);
      }

      const producto = productoResult.value;

      // ⭐⭐⭐ VALIDAR STOCK DISPONIBLE ⭐⭐⭐
      if (producto.getStock() < detalleDto.cantidad) {
        await queryRunner.rollbackTransaction();
        return Result.failure(
          `Stock insuficiente para ${producto.getNombre()}. ` +
          `Disponible: ${producto.getStock()}, Solicitado: ${detalleDto.cantidad}`
        );
      }

      // Validar que el producto esté activo
      if (producto.getEstado() !== 'activo') {
        await queryRunner.rollbackTransaction();
        return Result.failure(`El producto ${producto.getNombre()} no está disponible`);
      }

      // Crear entidad de detalle
      const detalle = new DetalleVentaProducto({
        producto: producto,
        cantidad: detalleDto.cantidad,
        precioUnitario: producto.getPrecioVenta(),
      });

      detallesEntities.push(detalle);
      subtotal += detalle.getSubtotal();
    }

    // 2. Calcular totales (PRECIOS INCLUYEN IGV)
    const descuento = dto.descuento || 0;
    const totalConDescuento = subtotal - descuento;
    const base = totalConDescuento / 1.18;
    const igv = totalConDescuento - base;

    const baseRedondeada = Math.round(base * 100) / 100;
    const igvRedondeado = Math.round(igv * 100) / 100;
    const total = totalConDescuento;

    const fecha = new Date(dto.fecha + 'T12:00:00')

    // 3. Crear la venta (cabecera)
    const venta = new VentaProducto({
      fecha: fecha,
      tipoComprobante: dto.tipoComprobante,
      numeroComprobante: numeroComprobante, // ⭐ Número autogenerado
      metodoPago: dto.metodoPago,
      subtotal: baseRedondeada,
      descuento: descuento,
      igv: igvRedondeado,
      total: total,
      clienteNombre: dto.clienteNombre,
      clienteDocumento: dto.clienteDocumento,
      observaciones: dto.observaciones,
    });

    // 4. Guardar la venta
    const ventaOrm = VentaProductoMapper.toOrmEntity(venta);
    const ventaSaved = await queryRunner.manager.save(VentaProductoOrmEntity, ventaOrm);

    console.log('✅ Venta creada:', ventaSaved.id);

    // 5. Guardar los detalles y DISMINUIR STOCK
    for (const detalle of detallesEntities) {
      const detalleOrm = DetalleVentaProductoMapper.toOrmEntity(detalle, ventaSaved.id);
      await queryRunner.manager.save(DetalleVentaProductoOrmEntity, detalleOrm);

      const producto = detalle.getProducto();
      const cantidadAntes = producto.getStock();

      producto.disminuirStock(detalle.getCantidad());

      const cantidadDespues = producto.getStock();

      const updateResult = await this.productoRepository.update(
        producto.getId(),
        producto,
      );

      if (!updateResult.ok) {
        await queryRunner.rollbackTransaction();
        return Result.failure('Error al actualizar stock del producto');
      }

      console.log(
        `📦 Stock actualizado - ${producto.getNombre()} | ${cantidadAntes} → ${cantidadDespues} (-${detalle.getCantidad()})`
      );
    }

    // 6. Commit de la transacción
    await queryRunner.commitTransaction();

    // 7. Recargar la venta con todas las relaciones
    const ventaCompleta = await this.ventaOrmRepository.findOne({
      where: { id: ventaSaved.id },
      relations: ['detalles', 'detalles.producto'],
    });

    if (!ventaCompleta) {
      return Result.failure('Error al recargar la venta');
    }

    console.log('✅ Venta completada exitosamente');

    return Result.success(VentaProductoMapper.toDomain(ventaCompleta));
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en CrearVentaProductoUseCase:', error);
    return Result.failure('Error al crear la venta', error);
  } finally {
    await queryRunner.release();
  }
}
}