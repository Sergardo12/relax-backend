import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CrearVentaProductoDto } from '../infrastructure/dto/crear-venta-producto.dto';
import { CrearVentaProductoUseCase } from '../application/uses-cases/crear-venta-producto.use-case';
import { ListarVentasUseCase } from '../application/uses-cases/listar-ventas.use-case';
import { ObtenerVentaConDetallesUseCase } from '../application/uses-cases/obtener-ventas-con-detalles.use-case';

@Controller('ventas')
export class VentaProductoController {
  constructor(
    private readonly crearVentaUseCase: CrearVentaProductoUseCase,
    private readonly listarVentasUseCase: ListarVentasUseCase,
    private readonly obtenerVentaUseCase: ObtenerVentaConDetallesUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearVentaProductoDto) {
    const result = await this.crearVentaUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get()
  async listar() {
    const result = await this.listarVentasUseCase.execute();

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
    const result = await this.obtenerVentaUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }
}