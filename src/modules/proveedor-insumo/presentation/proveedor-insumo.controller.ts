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
import { CrearProveedorInsumoDto } from '../infrastructure/dto/crear-proveedor-insumo.dto';
import { ActualizarProveedorInsumoDto } from '../infrastructure/dto/actualizar-proveedor-insumo.dto';
import { CrearProveedorInsumoUseCase } from '../application/uses-cases/crear-proveedor-insumo.use-case';
import { ListarProveedoresInsumoUseCase } from '../application/uses-cases/listar-proveedores-insumo.use-case';
import { ObtenerProveedorInsumoUseCase } from '../application/uses-cases/obtener-proveedor-insumo.use-case';
import { ActualizarProveedorInsumoUseCase } from '../application/uses-cases/actualizar-proveedor-insumo.use-case';
import { EliminarProveedorInsumoUseCase } from '../application/uses-cases/eliminar-proveedor-insumo.use-case';

@Controller('proveedores-insumo')
export class ProveedorInsumoController {
  constructor(
    private readonly crearProveedorUseCase: CrearProveedorInsumoUseCase,
    private readonly listarProveedoresUseCase: ListarProveedoresInsumoUseCase,
    private readonly obtenerProveedorUseCase: ObtenerProveedorInsumoUseCase,
    private readonly actualizarProveedorUseCase: ActualizarProveedorInsumoUseCase,
    private readonly eliminarProveedorUseCase: EliminarProveedorInsumoUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearProveedorInsumoDto) {
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
    @Body() dto: ActualizarProveedorInsumoDto,
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