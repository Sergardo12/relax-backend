import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Result } from 'src/common/types/result';
import { RegistroGasto } from '../../domain/entities/registro-gasto.entity';
import { DetalleGasto } from '../../domain/entities/detalle-gasto.entity';
import { ProveedorInsumoRepository } from '../../../proveedor-insumo/domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../../proveedor-insumo/infrastructure/proveedor-insumo.repository.token';
import { CrearRegistroGastoDto } from '../../infrastructure/dto/crear-registro-gasto.dto';
import { RegistroGastoOrmEntity } from '../../infrastructure/database/registro-gasto.orm-entity';
import { DetalleGastoOrmEntity } from '../../infrastructure/database/detalle-gasto.orm-entity';
import { RegistroGastoMapper } from '../../infrastructure/mapper/registro-gasto.mapper';
import { DetalleGastoMapper } from '../../infrastructure/mapper/detalle-gasto.mapper';

@Injectable()
export class CrearRegistroGastoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
    @InjectRepository(RegistroGastoOrmEntity)
    private readonly gastoOrmRepository: Repository<RegistroGastoOrmEntity>,
    @InjectRepository(DetalleGastoOrmEntity)
    private readonly detalleOrmRepository: Repository<DetalleGastoOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: CrearRegistroGastoDto): Promise<Result<RegistroGasto>> {
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

      // 2. Validar detalles y calcular total
      let total = 0;
      const detallesEntities: DetalleGasto[] = [];

      for (const detalleDto of dto.detalles) {
        // Crear entidad de detalle
        const detalle = new DetalleGasto({
          descripcion: detalleDto.descripcion,
          cantidad: detalleDto.cantidad,
          precioUnitario: detalleDto.precioUnitario,
        });

        detallesEntities.push(detalle);
        total += detalle.getSubtotal();
      }

      const fecha = new Date(dto.fecha + 'T12:00:00');

      // 3. Crear el registro de gasto (cabecera)
      const gasto = new RegistroGasto({
        proveedor: proveedor,
        fecha: fecha,
        categoria: dto.categoria,
        tipoComprobante: dto.tipoComprobante,
        numeroComprobante: dto.numeroComprobante,
        total: total,
        observaciones: dto.observaciones,
      });

      // 4. Guardar el gasto
      const gastoOrm = RegistroGastoMapper.toOrmEntity(gasto);
      const gastoSaved = await queryRunner.manager.save(RegistroGastoOrmEntity, gastoOrm);

      console.log('✅ Gasto registrado:', gastoSaved.id);

      // 5. Guardar los detalles (SIN actualizar stock)
      for (const detalle of detallesEntities) {
        const detalleOrm = DetalleGastoMapper.toOrmEntity(detalle, gastoSaved.id);
        await queryRunner.manager.save(DetalleGastoOrmEntity, detalleOrm);

        console.log(
          `📝 Detalle registrado: ${detalle.getDescripcion()} | ` +
          `Cantidad: ${detalle.getCantidad()} | ` +
          `Subtotal: S/ ${detalle.getSubtotal()}`
        );
      }

      // 6. Commit de la transacción
      await queryRunner.commitTransaction();

      // 7. Recargar el gasto con todas las relaciones
      const gastoCompleto = await this.gastoOrmRepository.findOne({
        where: { id: gastoSaved.id },
        relations: ['proveedor', 'detalles'],
      });

      if (!gastoCompleto) {
        return Result.failure('Error al recargar el gasto');
      }

      console.log(`✅ Gasto completado | Total: S/ ${total} | Categoría: ${dto.categoria}`);

      return Result.success(RegistroGastoMapper.toDomain(gastoCompleto));
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      console.error('❌ Error en CrearRegistroGastoUseCase:', error);
      return Result.failure('Error al crear el registro de gasto', error);
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }
}