import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { RegistroGastoRepository } from '../../domain/repositories/registro-gasto.repository';
import { REGISTRO_GASTO_REPOSITORY } from '../../infrastructure/registro-gasto.repository.token';
import { DetalleGastoRepository } from '../../domain/repositories/detalle-gasto.repository';
import { DETALLE_GASTO_REPOSITORY } from '../../infrastructure/detalle-gasto.repository.token';

@Injectable()
export class ObtenerGastoConDetallesUseCase {
  constructor(
    @Inject(REGISTRO_GASTO_REPOSITORY)
    private readonly gastoRepository: RegistroGastoRepository,
    @Inject(DETALLE_GASTO_REPOSITORY)
    private readonly detalleRepository: DetalleGastoRepository,
  ) {}

  async execute(id: string): Promise<Result<any>> {
    try {
      // 1. Obtener gasto
      const gastoResult = await this.gastoRepository.findById(id);

      if (!gastoResult.ok) {
        return Result.failure('Error al buscar el gasto');
      }

      if (!gastoResult.value) {
        return Result.failure('Gasto no encontrado');
      }

      const gasto = gastoResult.value;

      // 2. Obtener detalles
      const detallesResult = await this.detalleRepository.findByGastoId(id);

      if (!detallesResult.ok) {
        return Result.failure('Error al buscar los detalles');
      }

      // 3. Construir respuesta con detalles
      const respuesta = {
        ...gasto.toJSON(),
        detalles: detallesResult.value.map(d => d.toJSON()),
      };

      return Result.success(respuesta);
    } catch (error) {
      console.error('Error en ObtenerGastoConDetallesUseCase:', error);
      return Result.failure('Error al obtener el gasto', error);
    }
  }
}