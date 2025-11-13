import { Injectable, Inject } from '@nestjs/common';
import { Result } from 'src/common/types/result';
import { RegistroGasto } from '../../domain/entities/registro-gasto.entity';
import { RegistroGastoRepository } from '../../domain/repositories/registro-gasto.repository';
import { REGISTRO_GASTO_REPOSITORY } from '../../infrastructure/registro-gasto.repository.token';

@Injectable()
export class ListarGastosUseCase {
  constructor(
    @Inject(REGISTRO_GASTO_REPOSITORY)
    private readonly gastoRepository: RegistroGastoRepository,
  ) {}

  async execute(): Promise<Result<RegistroGasto[]>> {
    try {
      const result = await this.gastoRepository.findAll();

      if (!result.ok) {
        return Result.failure('Error al listar gastos');
      }

      return Result.success(result.value);
    } catch (error) {
      console.error('Error en ListarGastosUseCase:', error);
      return Result.failure('Error al listar gastos', error);
    }
  }
}