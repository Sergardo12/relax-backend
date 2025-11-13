import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CrearCompraProductoDto } from '../infrastructure/dto/crear-compra-producto.dto';
import { CrearCompraProductoUseCase } from '../application/uses-cases/crear-compra-producto.use-case';
import { ListarComprasUseCase } from '../application/uses-cases/listar-compras.use-case';
import { ObtenerCompraConDetallesUseCase } from '../application/uses-cases/obtener-compra-con-detalles.use-case';

@Controller('compras')
export class CompraProductoController {
  constructor(
    private readonly crearCompraUseCase: CrearCompraProductoUseCase,
    private readonly listarComprasUseCase: ListarComprasUseCase,
    private readonly obtenerCompraUseCase: ObtenerCompraConDetallesUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearCompraProductoDto) {
    const result = await this.crearCompraUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get()
  async listar() {
    const result = await this.listarComprasUseCase.execute();

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
    const result = await this.obtenerCompraUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }
}