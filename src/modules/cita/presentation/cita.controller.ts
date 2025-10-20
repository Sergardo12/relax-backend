import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CrearCitaUseCase } from '../application/use-cases/crear-cita.use-case';
import { ListarCitasUseCase } from '../application/use-cases/listar-citas.use-case';
import { ObtenerCitaPorIdUseCase } from '../application/use-cases/obtener-cita-por-id.use-case';
import { ActualizarCitaUseCase } from '../application/use-cases/actualizar-cita.use-case';
import { CancelarCitaUseCase } from '../application/use-cases/cancelar-cita.use-case';
import { CrearCitaDto } from '../infrastructure/dto/crear-cita.dto';
import { ActualizarCitaDto } from '../infrastructure/dto/actualizar-cita.dto';
import { ListarCitasDto } from '../infrastructure/dto/listar-citas.dto';
import { ListarMisCitasUseCase } from '../application/use-cases/listar-mis-citas.use-case';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioActual } from 'src/modules/auth/presentation/decorators/usuario-actual.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('citas')
export class CitaController {
  constructor(
    private readonly crearCitaUseCase: CrearCitaUseCase,
    private readonly listarCitasUseCase: ListarCitasUseCase,
    private readonly obtenerCitaPorIdUseCase: ObtenerCitaPorIdUseCase,
    private readonly actualizarCitaUseCase: ActualizarCitaUseCase,
    private readonly cancelarCitaUseCase: CancelarCitaUseCase,
     private readonly listarMisCitasUseCase: ListarMisCitasUseCase,
  ) {}

  @Post()
  async crearCita(@Body() dto: CrearCitaDto) {
    const result = await this.crearCitaUseCase.ejecutar(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get()
  async listarCitas(@Query() query: ListarCitasDto) {
    const result = await this.listarCitasUseCase.ejecutar(query);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('mis-citas')
  async listarMisCitas(@UsuarioActual('sub') usuarioId: string) {
    const result = await this.listarMisCitasUseCase.ejecutar(usuarioId);

    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get(':id')
  async obtenerCitaPorId(@Param('id') id: string) {
    const result = await this.obtenerCitaPorIdUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    if (!result.value) {
      throw new BadRequestException('Cita no encontrada');
    }

    return result.value;
  }

  @Put(':id')
  async actualizarCita(@Param('id') id: string, @Body() dto: ActualizarCitaDto) {
    const result = await this.actualizarCitaUseCase.ejecutar(id, dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Patch(':id/cancelar')
  async cancelarCita(@Param('id') id: string) {
    const result = await this.cancelarCitaUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
}
