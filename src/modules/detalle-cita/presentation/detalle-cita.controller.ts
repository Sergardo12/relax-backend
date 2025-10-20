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
import { CrearDetalleCitaUseCase } from '../application/use-cases/crear-detalle-cita.use-case';
import { ListarDetallesPorCitaUseCase } from '../application/use-cases/listar-detalles-por-cita.use-case';
import { ObtenerDetalleCitaUseCase } from '../application/use-cases/obtener-detalle-cita.use-case';
import { ActualizarObservacionesUseCase } from '../application/use-cases/actualizar-observaciones.use-case';
import { EliminarDetalleCitaUseCase } from '../application/use-cases/eliminar-detalle-cita.use-case';
import { CrearDetalleCitaDto } from '../infrastructure/dto/crear-detalle-cita.dto';
import { ActualizarObservacionesDto } from '../infrastructure/dto/actualizar-observaciones.dto';

@Controller('detalle-cita')
export class DetalleCitaController {
  constructor(
    private readonly crearDetalleCitaUseCase: CrearDetalleCitaUseCase,
    private readonly listarDetallesPorCitaUseCase: ListarDetallesPorCitaUseCase,
    private readonly obtenerDetalleCitaUseCase: ObtenerDetalleCitaUseCase,
    private readonly actualizarObservacionesUseCase: ActualizarObservacionesUseCase,
    private readonly eliminarDetalleCitaUseCase: EliminarDetalleCitaUseCase,
  ) {}

  @Post()
  async crearDetalleCita(@Body() dto: CrearDetalleCitaDto) {
    const result = await this.crearDetalleCitaUseCase.ejecutar(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get('cita/:idCita')
  async listarDetallesPorCita(@Param('idCita') idCita: string) {
    const result = await this.listarDetallesPorCitaUseCase.ejecutar(idCita);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get(':id')
  async obtenerDetalleCita(@Param('id') id: string) {
    const result = await this.obtenerDetalleCitaUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Put(':id/observaciones')
  async actualizarObservaciones(
    @Param('id') id: string,
    @Body() dto: ActualizarObservacionesDto,
  ) {
    const result = await this.actualizarObservacionesUseCase.ejecutar(id, dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminarDetalleCita(@Param('id') id: string) {
    const result = await this.eliminarDetalleCitaUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return { message: 'Detalle de cita eliminado exitosamente' };
  }
}
