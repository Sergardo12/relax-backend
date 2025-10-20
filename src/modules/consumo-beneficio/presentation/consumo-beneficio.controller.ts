import { Controller, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { ListarConsumosPorSuscripcionUseCase } from '../application/use-cases/listar-consumos-por-suscripcion.use-case';
import { ObtenerConsumoUseCase } from '../application/use-cases/obtener-consumo.use-case';

@Controller('consumos-beneficio')
export class ConsumoBeneficioController {
  constructor(
    private readonly listarConsumosPorSuscripcionUseCase: ListarConsumosPorSuscripcionUseCase,
    private readonly obtenerConsumoUseCase: ObtenerConsumoUseCase,
  ) {}

  @Get('suscripcion/:idSuscripcion')
  async listarPorSuscripcion(@Param('idSuscripcion') idSuscripcion: string) {
    const result = await this.listarConsumosPorSuscripcionUseCase.execute(idSuscripcion);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value;
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    const result = await this.obtenerConsumoUseCase.execute(id);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }
}