import { Controller, Get, Post, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CrearBeneficioMembresiaDto } from '../infrastructure/dto/crear-beneficio-membresia.dto';
import { CrearBeneficioMembresiaUseCase } from '../application/uses-cases/crear-beneficio-membresia.use-case';
import { ListarBeneficiosPorMembresiaUseCase } from '../application/uses-cases/listar-beneficios-por-membresia.use-case';
import { EliminarBeneficioMembresiaUseCase } from '../application/uses-cases/eliminar-beneficio-membresia.use-case';

@Controller('beneficios-membresia')
export class BeneficioMembresiaController {
  constructor(
    private readonly crearBeneficioUseCase: CrearBeneficioMembresiaUseCase,
    private readonly listarBeneficiosPorMembresiaUseCase: ListarBeneficiosPorMembresiaUseCase,
    private readonly eliminarBeneficioUseCase: EliminarBeneficioMembresiaUseCase,
  ) {}

  @Post()
  async crear(@Body() dto: CrearBeneficioMembresiaDto) {
    const result = await this.crearBeneficioUseCase.execute(dto);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('membresia/:idMembresia')
  async listarPorMembresia(@Param('idMembresia') idMembresia: string) {
    const result = await this.listarBeneficiosPorMembresiaUseCase.execute(idMembresia);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value;
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const result = await this.eliminarBeneficioUseCase.execute(id);
    
    if (!result.ok) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return { message: 'Beneficio eliminado exitosamente' };
  }
}