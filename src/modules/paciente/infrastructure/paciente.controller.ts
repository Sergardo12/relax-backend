import { Body,  Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { CrearPacienteUseCase } from '../application/use-cases/crear-paciente.use-case';
import { CrearPacienteDto } from './dto/crear-paciente.dto';
import { Paciente } from '../domain/entities/paciente.entity';
import { PACIENTE_REPOSITORY } from '../paciente.repository.token';
import { PacienteRepository } from '../domain/repositories/paciente.repository';

@Controller('pacientes')
export class PacienteController {
  constructor(
    private crearPacienteUseCase: CrearPacienteUseCase,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepo: PacienteRepository
  ) {}

  @Post()
  async crearPaciente(@Body() dto: CrearPacienteDto): Promise<Paciente> {
    return await this.crearPacienteUseCase.ejecutar(dto);
  }

  @Get()
  async listarPacientes(): Promise<Paciente[]> {
    return await this.pacienteRepo.listarTodos();
  }

  @Get(':id')
  async buscarPacientePorId(@Param('id') id: number): Promise<Paciente | null> {
    return await this.pacienteRepo.buscarPorId(id);
  }

  @Put(':id')
  async actualizarPaciente(
    @Param('id') id: number,
    @Body() dto: CrearPacienteDto,
  ): Promise<Paciente> {
    
    const paciente = await this.pacienteRepo.buscarPorId(id);

    if (!paciente) throw new Error('Paciente no encontrado');

    const actualizado = new Paciente(
      id,
      paciente.usuario, //conservamos el mismo usuario
      dto.nombres,
      dto.apellidos,
      dto.dni,
      dto.edad,
      dto.telefono,
      paciente.estadoPaciente,
    );
    return await this.pacienteRepo.actualizar(actualizado);
  }

  @Delete(':id')
  async eliminarPaciente(@Param('id') id: number): Promise<void> {
    await this.pacienteRepo.eliminar(id);
  }
}
