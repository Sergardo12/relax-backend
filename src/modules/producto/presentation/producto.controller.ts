import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Patch,
} from '@nestjs/common';
import { CrearProductoDto } from '../infrastructure/dto/crear-producto.dto';
import { ActualizarProductoDto } from '../infrastructure/dto/actualizar-producto.dto';
import { CrearProductoUseCase } from '../application/uses-cases/crear-producto.use-case';
import { ListarProductosUseCase } from '../application/uses-cases/listar-productos.use-case';
import { ObtenerProductoUseCase } from '../application/uses-cases/obtener-producto.use-case';
import { ActualizarProductoUseCase } from '../application/uses-cases/actualizar-producto.use-case';
import { EliminarProductoUseCase } from '../application/uses-cases/eliminar-producto.use-case';
import { ListarProductosStockBajoUseCase } from '../application/uses-cases/listar-productos-stock-bajo.use-case';
import { AjustarStockProductoUseCase } from '../application/uses-cases/ajustar-stock-producto.use-case';
import { AjustarStockProductoDto } from '../infrastructure/dto/ajustar-stock-producto.use-case';

@Controller('productos') // localhost:3000/productos
export class ProductoController {
  constructor(
    private readonly crearProductoUseCase: CrearProductoUseCase,
    private readonly listarProductosUseCase: ListarProductosUseCase,
    private readonly obtenerProductoUseCase: ObtenerProductoUseCase,
    private readonly actualizarProductoUseCase: ActualizarProductoUseCase,
    private readonly eliminarProductoUseCase: EliminarProductoUseCase,
    private readonly listarProductosStockBajoUseCase: ListarProductosStockBajoUseCase,
    private readonly ajustarStockProductoUseCase: AjustarStockProductoUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearProductoDto) {
    const result = await this.crearProductoUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get()
  async listar() {
    const result = await this.listarProductosUseCase.execute();

    if (!result.ok) {
      throw new HttpException(
        result.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value;
  }

  @Get('stock-bajo')
  async listarStockBajo() {
    const result = await this.listarProductosStockBajoUseCase.execute();

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
    const result = await this.obtenerProductoUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    const result = await this.actualizarProductoUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Patch(':id/ajustar-stock') // ⭐ Nuevo endpoint
  async ajustarStock(
    @Param('id') id: string,
    @Body() dto: AjustarStockProductoDto,
  ) {
    const result = await this.ajustarStockProductoUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const result = await this.eliminarProductoUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Producto eliminado correctamente' };
  }
}