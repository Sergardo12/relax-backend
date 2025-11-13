import { BadRequestException, Body, Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';
import { CompletarDatosPacienteUseCase } from '../application/uses-cases/completarDatosPaciente.use-case';
import { CrearPacienteDto } from '../infrastructure/dto/completar-datos-paciente';
import { AuthGuard } from '@nestjs/passport';
import { ObtenerPerfilPaciente } from '../application/uses-cases/obtener-perfil-paciente-use-case';
import { identity } from 'rxjs';
import { UsuarioActual } from 'src/modules/auth/presentation/decorators/usuario-actual.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ListarPacientesUseCase } from '../application/uses-cases/listar-pacientes.use-case';
import { Result } from 'src/common/types/result';
import { Paciente } from '../domain/entities/paciente.entity';

@Controller('pacientes')
export class PacienteController {
  constructor(
    private readonly completarDatosPacienteUseCase: CompletarDatosPacienteUseCase,
    private readonly obtenerPerfilPacienteUseCase: ObtenerPerfilPaciente,
    private readonly listarPacientesUseCase: ListarPacientesUseCase
  ) {}

  @Post('completar-datos')
  async completarDatosPaciente(@Body() dto: CrearPacienteDto) {
    const result = await this.completarDatosPacienteUseCase.ejecutar(dto);

    if (!result.ok) {
      throw new BadRequestException(result.message);
    }

    return result.value;
  }
   @Get()
  async listarTodosLosPacientes(){
    const result = await this.listarPacientesUseCase.ejecutar()
    if(!result.ok){
      throw new BadRequestException(result.message);
    }
    return result.value
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async obtenerMiPerfil(@UsuarioActual('sub') usuarioId: string) {
    const result = await this.obtenerPerfilPacienteUseCase.ejecutar(usuarioId);

    if (!result.ok) {
      throw new BadRequestException('No se encontró el perfil del paciente');
    }
    const paciente = result.value; 
  

    return {
      id: paciente.getId(),
      nombres: paciente.getNombres(),
      apellidos: paciente.getApellidos(),
      dni: paciente.getDni(),
      telefono: paciente.getTelefono(),
      fechaNacimiento: paciente.getFechaNacimiento(),
    };
  }

 
}
