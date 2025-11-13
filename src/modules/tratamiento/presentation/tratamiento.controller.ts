import { Controller, Post, Get, Put, Delete, Body, Param, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { CrearTratamientoUseCase } from '../application/use-cases/crear-tratamiento.use-case';
import { ObtenerTratamientoUseCase } from '../application/use-cases/obtener-tratamiento.use-case';
import { ActualizarTratamientoUseCase } from '../application/use-cases/actualizar-tratamiento.use-case';
import { CancelarTratamientoUseCase } from '../application/use-cases/cancelar-tratamiento.use-case';
import { CrearTratamientoDto } from '../infrastructure/dto/crear-tratamiento.dto';
import { ActualizarTratamientoDto } from '../infrastructure/dto/actualizar-tratamiento.dto';
import { ListarTratamientosPacienteUseCase } from '../application/use-cases/listar-tratamientos-paciente.use-case';
import { ListarTratamientosUseCase } from '../application/use-cases/listar-tratamientos.use-case';

@Controller('tratamientos')
export class TratamientoController {
  constructor(
    private readonly crearTratamientoUseCase: CrearTratamientoUseCase,
    private readonly obtenerTratamientoUseCase: ObtenerTratamientoUseCase,
    private readonly listarTratamientosPacienteUseCase: ListarTratamientosPacienteUseCase,
    private readonly actualizarTratamientoUseCase: ActualizarTratamientoUseCase,
    private readonly cancelarTratamientoUseCase: CancelarTratamientoUseCase,
    private readonly listarTratamientosUseCase: ListarTratamientosUseCase
  ) {}

  @Post()
  async crear(@Body() dto: CrearTratamientoDto) {
    const result = await this.crearTratamientoUseCase.execute(dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }

  @Get()
  async listarTratamientos(){
    const result = await this.listarTratamientosUseCase.ejecutar()
    if(!result.ok){
      throw new HttpException(result.message, HttpStatus.NOT_FOUND)
    }
    return result.value
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const result = await this.obtenerTratamientoUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.NOT_FOUND);
    }

    return result.value.toJSON();
  }

  @Get('paciente/:idPaciente')
  async listarPorPaciente(@Param('idPaciente') idPaciente: string) {
    const result = await this.listarTratamientosPacienteUseCase.execute(idPaciente);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.map(t => t.toJSON());
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarTratamientoDto) {
    const result = await this.actualizarTratamientoUseCase.execute(id, dto);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }

  @Delete(':id')
  async cancelar(@Param('id') id: string) {
    const result = await this.cancelarTratamientoUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value.toJSON();
  }
}