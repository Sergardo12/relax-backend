import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CrearRegistroGastoDto } from '../infrastructure/dto/crear-registro-gasto.dto';
import { CrearRegistroGastoUseCase } from '../application/uses-cases/crear-registro.use-case';
import { ListarGastosUseCase } from '../application/uses-cases/listar-gastos.use-case';
import { ObtenerGastoConDetallesUseCase } from '../application/uses-cases/obtener-gasto-con-detalles.use-case';
import { ListarGastosPorCategoriaUseCase } from '../application/uses-cases/listar-gastos-por-categoria.use-case';

@Controller('gastos')
export class RegistroGastoController {
  constructor(
    private readonly crearGastoUseCase: CrearRegistroGastoUseCase,
    private readonly listarGastosUseCase: ListarGastosUseCase,
    private readonly obtenerGastoUseCase: ObtenerGastoConDetallesUseCase,
    private readonly listarGastosPorCategoriaUseCase: ListarGastosPorCategoriaUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearRegistroGastoDto) {
    const result = await this.crearGastoUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get()
  async listar() {
    const result = await this.listarGastosUseCase.execute();

    if (!result.ok) {
      throw new HttpException(
        result.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value;
  }

  @Get('categoria/:categoria')
  async listarPorCategoria(@Param('categoria') categoria: string) {
    const result = await this.listarGastosPorCategoriaUseCase.execute(categoria);

    if (!result.ok) {
      throw new HttpException(
        result.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value;
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    const result = await this.obtenerGastoUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }
}