import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { ProveedorInsumo } from '../../domain/entities/proveedor-insumo.entity';
import { ProveedorInsumoRepository } from '../../domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../infrastructure/proveedor-insumo.repository.token';
import { CrearProveedorInsumoDto } from '../../infrastructure/dto/crear-proveedor-insumo.dto';

@Injectable()
export class CrearProveedorInsumoUseCase {
  constructor(
    @Inject(PROVEEDOR_INSUMO_REPOSITORY)
    private readonly proveedorRepository: ProveedorInsumoRepository,
  ) {}

  async execute(dto: CrearProveedorInsumoDto): Promise<Result<ProveedorInsumo>> {
    try {
      const proveedor = new ProveedorInsumo({
        nombre: dto.nombre,
        ruc: dto.ruc,
        telefono: dto.telefono,
        email: dto.email,
        direccion: dto.direccion,
      });

      const result = await this.proveedorRepository.create(proveedor);

      if (!result.ok) {
        return Result.failure('Error al crear el proveedor');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en CrearProveedorInsumoUseCase:', error);
      return Result.failure('Error al crear el proveedor', error);
    }
  }
}