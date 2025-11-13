import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../infrastructure/proveedor-insumo.repository.token';
import { ActualizarProveedorInsumoDto } from '../../infrastructure/dto/actualizar-proveedor-insumo.dto';

@Injectable()
export class ActualizarProveedorInsumoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
  ) {}

  async execute(id: string, dto: ActualizarProveedorInsumoDto): Promise<Result<ProveedorInsumo>> {
    try {
      const proveedorResult = await this.proveedorRepository.findById(id);

      if (!proveedorResult.ok || !proveedorResult.value) {
        return Result.failure('Proveedor no encontrado');
      }

      const proveedor = proveedorResult.value;

      const proveedorActualizado = new ProveedorInsumo({
        id: proveedor.getId(),
        nombre: dto.nombre ?? proveedor.getNombre(),
        ruc: proveedor.getRuc(),
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
      console.error('Error en ActualizarProveedorInsumoUseCase:', error);
      return Result.failure('Error al actualizar el proveedor', error);
    }
  }
}