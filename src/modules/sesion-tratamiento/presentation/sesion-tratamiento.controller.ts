import { Controller, Post, Get, Put, Patch, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CrearSesionTratamientoDto } from '../infrastructure/dto/crear-sesion-tratamiento.dto';
import { ActualizarSesionTratamientoDto } from '../infrastructure/dto/actualizar-sesion-tratamiento.dto';
import { CrearSesionTratamientoUseCase } from '../application/uses-cases/crear-sesion-tratamiento.use-case';
import { ObtenerSesionTratamientoUseCase } from '../application/uses-cases/obtener-sesion-tratamiento.use-case';
import { ListarSesionesTratamientoUseCase } from '../application/uses-cases/listar-sesion-tratamiento.use-case';
import { CompletarSesionTratamientoUseCase } from '../application/uses-cases/completar-sesion-tratamiento.use-case';
import { ActualizarSesionTratamientoUseCase } from '../application/uses-cases/actualizar-sesion-tratamiento.use-case';
import { CancelarSesionTratamientoUseCase } from '../application/uses-cases/cancelar-sesion-tratamiento.use-case';
import { CompletarSesionDto } from '../infrastructure/dto/completar-sesion-tratamiento.dto';


@Controller('sesiones-tratamiento')
export class SesionTratamientoController {
  constructor(
    private readonly crearSesionUseCase: CrearSesionTratamientoUseCase,
    private readonly obtenerSesionUseCase: ObtenerSesionTratamientoUseCase,
    private readonly listarSesionesUseCase: ListarSesionesTratamientoUseCase,
    private readonly completarSesionUseCase: CompletarSesionTratamientoUseCase,
    private readonly actualizarSesionUseCase: ActualizarSesionTratamientoUseCase,
    private readonly cancelarSesionUseCase: CancelarSesionTratamientoUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearSesionTratamientoDto) {
    const result = await this.crearSesionUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const result = await this.obtenerSesionUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value.toJSON();
  }

  @Get('tratamiento/:idTratamiento')
  async listarPorTratamiento(@Param('idTratamiento') idTratamiento: string) {
    const result = await this.listarSesionesUseCase.execute(idTratamiento);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.map(s => s.toJSON());
  }

  @Patch(':id/completar')
  async completar(@Param('id') id: string, @Body() dto: CompletarSesionDto) {
    const result = await this.completarSesionUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarSesionTratamientoDto) {
    const result = await this.actualizarSesionUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }

  @Delete(':id')
  async cancelar(@Param('id') id: string) {
    const result = await this.cancelarSesionUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }
}