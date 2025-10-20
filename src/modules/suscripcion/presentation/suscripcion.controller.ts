import { Controller, Get, Post, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CrearSuscripcionUseCase } from '../application/use-cases/crear-suscripcion.use-case';
import { ListarSuscripcionesPorPacienteUseCase } from '../application/use-cases/listar-suscripciones-por-paciente.use-case';
import { CancelarSuscripcionUseCase } from '../application/use-cases/cancelar-suscripcion.use-case';
import { CrearSuscripcionDto } from '../infrastructure/dto/crear-suscripcion.dto';

@Controller('suscripciones') // localhost:3000/suscripciones
export class SuscripcionController {
  constructor(
    private readonly crearSuscripcionUseCase: CrearSuscripcionUseCase,
    private readonly listarSuscripcionesPorPacienteUseCase: ListarSuscripcionesPorPacienteUseCase,
    private readonly cancelarSuscripcionUseCase: CancelarSuscripcionUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearSuscripcionDto) {
    const result = await this.crearSuscripcionUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('paciente/:idPaciente')
  async listarPorPaciente(@Param('idPaciente') idPaciente: string) {
    const result = await this.listarSuscripcionesPorPacienteUseCase.execute(idPaciente);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value;
  }

  @Delete(':id')
  async cancelar(@Param('id') id: string) {
    const result = await this.cancelarSuscripcionUseCase.execute(id);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }
}