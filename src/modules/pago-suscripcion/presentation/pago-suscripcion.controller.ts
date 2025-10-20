import { Controller, Get, Post, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PagarSuscripcionTarjetaDto } from '../infrastructure/dto/pagar-suscripcion-tarjeta.dto';
import { PagarSuscripcionEfectivoDto } from '../infrastructure/dto/pagar-suscripcion-efectivo.dto';
import { PagarSuscripcionYapeDto } from '../infrastructure/dto/pagar-suscripcion-yape.dto';
import { PagarSuscripcionTarjetaUseCase } from '../application/uses-cases/pagar-suscripcion-tarjeta.use-case';
import { PagarSuscripcionYapeUseCase } from '../application/uses-cases/pagar-suscripcion-yape.use-case';
import { PagarSuscripcionEfectivoUseCase } from '../application/uses-cases/pagar-suscripcion-efectivo.use-case';
import { ListarPagosPorSuscripcionUseCase } from '../application/uses-cases/listar-pagos-por-suscripcion.use-case';

@Controller('pagos-suscripcion')
export class PagoSuscripcionController {
  constructor(
    private readonly pagarTarjetaUseCase: PagarSuscripcionTarjetaUseCase,
    private readonly pagarEfectivoUseCase: PagarSuscripcionEfectivoUseCase,
    private readonly pagarYapeUseCase: PagarSuscripcionYapeUseCase,
    private readonly listarPagosPorSuscripcionUseCase: ListarPagosPorSuscripcionUseCase,
  ) {}

  @Post('tarjeta')
  async pagarConTarjeta(@Body() dto: PagarSuscripcionTarjetaDto) {
    const result = await this.pagarTarjetaUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Post('efectivo')
  async pagarConEfectivo(@Body() dto: PagarSuscripcionEfectivoDto) {
    const result = await this.pagarEfectivoUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Post('yape')
  async pagarConYape(@Body() dto: PagarSuscripcionYapeDto) {
    const result = await this.pagarYapeUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('suscripcion/:idSuscripcion')
  async listarPorSuscripcion(@Param('idSuscripcion') idSuscripcion: string) {
    const result = await this.listarPagosPorSuscripcionUseCase.execute(idSuscripcion);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value;
  }
}
