import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ActualizarProveedorDto } from '../../infrastructure/dto/actualizar-proveedor.dto';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';

@Injectable()
export class ActualizarProveedorProductoUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(id: string, dto: ActualizarProveedorDto): Promise<Result<ProveedorProducto>> {
    try {
      const proveedorResult = await this.proveedorRepository.findById(id);

      if (!proveedorResult.ok || !proveedorResult.value) {
        return Result.failure('Proveedor no encontrado');
      }

      const proveedor = proveedorResult.value;

      // Reconstruir el proveedor con los valores actualizados
      const proveedorActualizado = new ProveedorProducto({
        id: proveedor.getId(),
        nombre: dto.nombre ?? proveedor.getNombre(),
        ruc: proveedor.getRuc(), // RUC no se modifica
        telefono: dto.telefono ?? proveedor.getTelefono(),
        email: dto.email ?? proveedor.getEmail(),
        direccion: dto.direccion ?? proveedor.getDireccion(),
        estado: dto.estado ?? proveedor.getEstado(),
        creadoEn: proveedor.getCreadoEn(),
        actualizadoEn: new Date(),
      });

      const result = await this.proveedorRepository.update(id, proveedorActualizado);

      if (!result.ok) {
        return Result.failure('Error al actualizar el proveedor');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ActualizarProveedorUseCase:', error);
      return Result.failure('Error al actualizar el proveedor', error);
    }
  }
}