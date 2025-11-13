import { Controller, Post, Get, Body, Param, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { PagarConTarjetaDto } from '../infrastructure/dto/pagar-con-tarjeta.dto';
import { PagarConYapeDto } from '../infrastructure/dto/pagar-con-yape.dto';
import { PagarConEfectivoDto } from '../infrastructure/dto/pagar-con-efectivo.dto';
import { PagarConTarjetaUseCase } from '../application/use-cases/pagar-con-tarjeta.use-case';
import { PagarConYapeUseCase } from '../application/use-cases/pagar-con-yape.use-case';
import { PagarConEfectivoUseCase } from '../application/use-cases/pagar-con-efectivo.use-case';
import { ObtenerPagosPorCitaUseCase } from '../application/use-cases/obtener-pagos-por-cita.use-case';
import { ObtenerPagoPorIdUseCase } from '../application/use-cases/obtener-pago-por-id.use-case';
import { PagarConMembresiaUseCase } from '../application/use-cases/pagar-con-membresia';
import { PagarConMembresiaDto } from '../infrastructure/dto/pagar-con-membresia';

@Controller('pagos-cita')
export class PagoCitaController {
  constructor(
    private readonly pagarConTarjetaUseCase: PagarConTarjetaUseCase,
    private readonly pagarConYapeUseCase: PagarConYapeUseCase,
    private readonly pagarConEfectivoUseCase: PagarConEfectivoUseCase,
    private readonly obtenerPagosPorCitaUseCase: ObtenerPagosPorCitaUseCase,
    private readonly obtenerPagoPorIdUseCase: ObtenerPagoPorIdUseCase,
    private readonly pagarConMembresiaUseCase: PagarConMembresiaUseCase
  ) {}

  @Post('tarjeta')
  async pagarConTarjeta(@Body() dto: PagarConTarjetaDto) {
    const result = await this.pagarConTarjetaUseCase.execute(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Post('yape')
  async pagarConYape(@Body() dto: PagarConYapeDto) {
    const result = await this.pagarConYapeUseCase.execute(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Post('efectivo')
  async pagarConEfectivo(@Body() dto: PagarConEfectivoDto) {
    const result = await this.pagarConEfectivoUseCase.execute(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
  @Post('membresia')
  async pagarConMembresia(@Body() dto: PagarConMembresiaDto) {
    try {
      const result = await this.pagarConMembresiaUseCase.execute(dto);

      if (!result.ok) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return result.value;
    } catch (error) {
      console.error('💥 ERROR:', error);
      throw new HttpException(
        error.message || 'Error al procesar pago con membresía',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cita/:idCita')
  async obtenerPagosPorCita(@Param('idCita') idCita: string) {
    const result = await this.obtenerPagosPorCitaUseCase.execute(idCita);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get(':id')
  async obtenerPagoPorId(@Param('id') id: string) {
    const result = await this.obtenerPagoPorIdUseCase.execute(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
}
