import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CrearHorarioColaboradorUseCase } from '../application/use-cases/crear-horario-colaborador.use-case';
import { ListarHorariosPorColaboradorUseCase } from '../application/use-cases/listar-horarios-por-colaborador.use-case';
import { ObtenerHorarioColaboradorUseCase } from '../application/use-cases/obtener-horario-colaborador.use-case';
import { ActualizarHorarioColaboradorUseCase } from '../application/use-cases/actualizar-horario-colaborador.use-case';
import { EliminarHorarioColaboradorUseCase } from '../application/use-cases/eliminar-horario-colaborador.use-case';
import { CrearHorarioColaboradorDto } from '../infrastructure/dto/crear-horario-colaborador.dto';
import { ActualizarHorarioColaboradorDto } from '../infrastructure/dto/actualizar-horario-colaborador.dto';

@Controller('horarios-colaborador')
export class HorarioColaboradorController {
  constructor(
    private readonly crearHorarioColaboradorUseCase: CrearHorarioColaboradorUseCase,
    private readonly listarHorariosPorColaboradorUseCase: ListarHorariosPorColaboradorUseCase,
    private readonly obtenerHorarioColaboradorUseCase: ObtenerHorarioColaboradorUseCase,
    private readonly actualizarHorarioColaboradorUseCase: ActualizarHorarioColaboradorUseCase,
    private readonly eliminarHorarioColaboradorUseCase: EliminarHorarioColaboradorUseCase,
  ) {}

  @Post()
  async crearHorarioColaborador(@Body() dto: CrearHorarioColaboradorDto) {
    const result = await this.crearHorarioColaboradorUseCase.ejecutar(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get('colaborador/:idColaborador')
  async listarHorariosPorColaborador(
    @Param('idColaborador') idColaborador: string,
  ) {
    const result = await this.listarHorariosPorColaboradorUseCase.ejecutar(
      idColaborador,
    );

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get(':id')
  async obtenerHorarioColaborador(@Param('id') id: string) {
    const result = await this.obtenerHorarioColaboradorUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Put(':id')
  async actualizarHorarioColaborador(
    @Param('id') id: string,
    @Body() dto: ActualizarHorarioColaboradorDto,
  ) {
    const result = await this.actualizarHorarioColaboradorUseCase.ejecutar(
      id,
      dto,
    );

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminarHorarioColaborador(@Param('id') id: string) {
    const result = await this.eliminarHorarioColaboradorUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
}
