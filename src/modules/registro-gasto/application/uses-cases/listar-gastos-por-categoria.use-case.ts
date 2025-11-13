import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { RegistroGasto } from '../../domain/entities/registro-gasto.entity';
import { RegistroGastoRepository } from '../../domain/repositories/registro-gasto.repository';
import { REGISTRO_GASTO_REPOSITORY } from '../../infrastructure/registro-gasto.repository.token';

@Injectable()
export class ListarGastosPorCategoriaUseCase {
  constructor(
    @Inject(REGISTRO_GASTO_REPOSITORY)
    private readonly gastoRepository: RegistroGastoRepository,
  ) {}

  async execute(categoria: string): Promise<Result<RegistroGasto[]>> {
    try {
      const result = await this.gastoRepository.findByCategoria(categoria);

      if (!result.ok) {
        return Result.failure('Error al listar gastos por categoría');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarGastosPorCategoriaUseCase:', error);
      return Result.failure('Error al listar gastos por categoría', error);
    }
  }
}