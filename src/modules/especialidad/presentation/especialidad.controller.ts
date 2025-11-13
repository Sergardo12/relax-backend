import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CrearEspecialidadUseCase } from "../application/use-cases/crear-especialidad.use-case";
import { CrearEspecialidadDto } from "../infrastructure/dto/crearEspecialidad.dto";
import { ListarEspecialidadesUseCase } from "../application/use-cases/listar-especialidades.use-case";
import { Result } from "src/common/types/result";
import { ObtenerEspecialidadPorId } from "../application/use-cases/obtener-especialidad.use-case";

@Controller('especialidades')
export class EspecialidadController{
    constructor(
        private readonly crearEspecialidadUseCase: CrearEspecialidadUseCase,
        private readonly listarEspecialidades: ListarEspecialidadesUseCase,
        private readonly obtenerEspecialidadPorId: ObtenerEspecialidadPorId
    ){}

    @Post()
    async crearEspecialidad (@Body() dto: CrearEspecialidadDto){
        const result = await this.crearEspecialidadUseCase.ejecutar(dto)
        if(!result.ok){
            throw new BadRequestException(result.message)
        }

        return result.value;
    }

    @Get('activas')
    async listarTodasLasEspecialidades(){
        const result = await this.listarEspecialidades.ejecutar()
        if (!result.ok) {
            throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return result.value;
    }

    @Get(':id')
    async obtenerEspecialidad(@Param('id') id: string){
        const result = await this.obtenerEspecialidadPorId.ejecutar(id)
        if(!result.ok){
            throw new HttpException(result.message, HttpStatus.NOT_FOUND)
        }
        return result.value
    }

    
}