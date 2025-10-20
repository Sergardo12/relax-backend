import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CrearMembresiaDto } from '../infrastructure/dto/crear-membresia.dto';
import { ActualizarMembresiaDto } from '../infrastructure/dto/actualizar-membresia.dto';
import { CrearMembresiaUseCase } from '../application/uses-cases/crear-membresia.use-case';
import { ListarMembresiasActivasUseCase } from '../application/uses-cases/listar-membresias.use-case';
import { ObtenerMembresiaUseCase } from '../application/uses-cases/obtener-membresia.use-case';
import { ActualizarMembresiaUseCase } from '../application/uses-cases/actualizar-membresia.use-case';
import { DesactivarMembresiaUseCase } from '../application/uses-cases/desactivar-membresia.use-case';

@Controller('membresias')
export class MembresiaController {
  constructor(
    private readonly crearMembresiaUseCase: CrearMembresiaUseCase,
    private readonly listarMembresiasActivasUseCase: ListarMembresiasActivasUseCase,
    private readonly obtenerMembresiaUseCase: ObtenerMembresiaUseCase,
    private readonly actualizarMembresiaUseCase: ActualizarMembresiaUseCase,
    private readonly desactivarMembresiaUseCase: DesactivarMembresiaUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearMembresiaDto) {
    const result = await this.crearMembresiaUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('activas')
  async listarActivas() {
    const result = await this.listarMembresiasActivasUseCase.execute();
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value;
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    const result = await this.obtenerMembresiaUseCase.execute(id);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value;
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarMembresiaDto) {
    const result = await this.actualizarMembresiaUseCase.execute(id, dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Delete(':id')
  async desactivar(@Param('id') id: string) {
    const result = await this.desactivarMembresiaUseCase.execute(id);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }
}