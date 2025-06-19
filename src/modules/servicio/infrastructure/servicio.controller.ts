import { Body, Controller, Post } from '@nestjs/common';
import { Servicio } from '../domain/entities/servicio.entity';
import { CrearServicioUseCase } from '../application/use-cases/crear-servicio.use-case';
import { CrearServicioDto } from './dto/crear-servicio.dto';


@Controller('servicios')
export class ServicioController {
  constructor(
    private readonly crearServicioUseCase: CrearServicioUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearServicioDto): Promise<Servicio> {
    return this.crearServicioUseCase.ejecutar(dto);
  }
}
