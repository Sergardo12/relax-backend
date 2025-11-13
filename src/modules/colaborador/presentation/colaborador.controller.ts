import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CrearColaboradorUseCase } from '../application/use-cases/crear-colaborador.use-case';
import { ListarColaboradoresUseCase } from '../application/use-cases/listar-colaboradores.use-case';
import { ObtenerColaboradorPorIdUseCase } from '../application/use-cases/obtener-colaborador-por-id.use-case';
import { ActualizarColaboradorUseCase } from '../application/use-cases/actualizar-colaborador.use-case';
import { EliminarColaboradorUseCase } from '../application/use-cases/eliminar-colaborador.use-case';
import { CrearColaboradorDto } from '../infrastructure/dto/crear-colaborador.dto';
import { ActualizarColaboradorDto } from '../infrastructure/dto/actualizar-colaborador.dto';
import { ListarColaboradoresDto } from '../infrastructure/dto/listar-colaboradores.dto';
import { UsuarioActual } from 'src/modules/auth/presentation/decorators/usuario-actual.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ObtenerPerfilColaboradorUseCase } from '../application/use-cases/obtener-perfil-colaborador.use-case';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('colaboradores')
export class ColaboradorController {
  constructor(
    private readonly crearColaboradorUseCase: CrearColaboradorUseCase,
    private readonly listarColaboradoresUseCase: ListarColaboradoresUseCase,
    private readonly obtenerColaboradorPorIdUseCase: ObtenerColaboradorPorIdUseCase,
    private readonly actualizarColaboradorUseCase: ActualizarColaboradorUseCase,
    private readonly eliminarColaboradorUseCase: EliminarColaboradorUseCase,
    private readonly obtenerPerfilColaboradorUseCase: ObtenerPerfilColaboradorUseCase
  ) {}

  @Post()
  async crearColaborador(@Body() dto: CrearColaboradorDto) {
    const result = await this.crearColaboradorUseCase.ejecutar(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Get()
  async listarColaboradores(@Query() query: ListarColaboradoresDto) {
    const result = await this.listarColaboradoresUseCase.ejecutar(query);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async obtenerMiPerfil(@UsuarioActual('sub') usuarioId: string) {
    const result = await this.obtenerPerfilColaboradorUseCase.ejecutar(usuarioId);

    if (!result.ok) {
      throw new BadRequestException('No se encontró el perfil del colaborador');
    }

    const colaborador = result.value;
    
    return {
      id: colaborador.getId(),
      nombres: colaborador.getNombres(),
      apellidos: colaborador.getApellidos(),
      dni: colaborador.getDni(),
      telefono: colaborador.getTelefono(),
      fechaNacimiento: colaborador.getFechaNacimiento(),
      fechaContratacion: colaborador.getFechaContratacion(),
      especialidad: {
        id: colaborador.getEspecialidad().id,
        nombre: colaborador.getEspecialidad().nombre,
      },
    };
  }


  @Get(':id')
  async obtenerColaboradorPorId(@Param('id') id: string) {
    const result = await this.obtenerColaboradorPorIdUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  
  @Put(':id')
  async actualizarColaborador(
    @Param('id') id: string,
    @Body() dto: ActualizarColaboradorDto,
  ) {
    const result = await this.actualizarColaboradorUseCase.ejecutar(id, dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminarColaborador(@Param('id') id: string) {
    const result = await this.eliminarColaboradorUseCase.ejecutar(id);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
}
