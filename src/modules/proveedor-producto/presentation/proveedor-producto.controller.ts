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
} from '@nestjs/common';
import { CrearProveedorDto } from '../infrastructure/dto/crear-proveedor.dto';
import { ActualizarProveedorDto } from '../infrastructure/dto/actualizar-proveedor.dto';
import { CrearProveedorProductoUseCase } from '../application/uses-cases/crear-producto.use-case';
import { ListarProveedoresProductoUseCase } from '../application/uses-cases/listar-proveedores-producto.use-case';
import { ObtenerProveedorProductoUseCase } from '../application/uses-cases/obtener-proveedor-producto.use-case';
import { ActualizarProveedorProductoUseCase } from '../application/uses-cases/actualizar-proveedor-producto.use-case';
import { EliminarProveedorProductoUseCase } from '../application/uses-cases/eliminar-proveedor-producto.use-case';
import { ListarProveedoresProductoActivosUseCase } from '../application/uses-cases/listar-proveedores-producto-activos.use-case';

@Controller('proveedores')
export class ProveedorProductoController {
  constructor(
    private readonly crearProveedorUseCase: CrearProveedorProductoUseCase,
    private readonly listarProveedoresUseCase: ListarProveedoresProductoUseCase,
    private readonly obtenerProveedorUseCase: ObtenerProveedorProductoUseCase,
    private readonly actualizarProveedorUseCase: ActualizarProveedorProductoUseCase,
    private readonly eliminarProveedorUseCase: EliminarProveedorProductoUseCase,
    private readonly listarProveedoresActivosUseCase: ListarProveedoresProductoActivosUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearProveedorDto) {
    const result = await this.crearProveedorUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get()
  async listar() {
    const result = await this.listarProveedoresUseCase.execute();

    if (!result.ok) {
      throw new HttpException(
        result.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.value;
  }

  @Get('activos')
  async listarActivos() {
    const result = await this.listarProveedoresActivosUseCase.execute();

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
    const result = await this.obtenerProveedorUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }

  @Put(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarProveedorDto,
  ) {
    const result = await this.actualizarProveedorUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const result = await this.eliminarProveedorUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Proveedor eliminado correctamente' };
  }
}