import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { CrearProveedorDto } from '../../infrastructure/dto/crear-proveedor.dto';
import { ProveedorProducto } from '../../domain/entities/proveedor-producto.entity';
import { ProveedorProductoRepository } from '../../domain/repositories/proveedor-producto.repository';
import { PROVEEDOR_PRODUCTO_REPOSITORY } from '../../infrastructure/proveedor-producto.repository.token';

@Injectable()
export class CrearProveedorProductoUseCase {
  constructor(
    @Inject(PROVEEDOR_PRODUCTO_REPOSITORY)
    private readonly proveedorRepository: ProveedorProductoRepository,
  ) {}

  async execute(dto: CrearProveedorDto): Promise<Result<ProveedorProducto>> {
    try {
      const proveedor = new ProveedorProducto({
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
      console.error('Error en CrearProveedorUseCase:', error);
      return Result.failure('Error al crear el proveedor', error);
    }
  }
}