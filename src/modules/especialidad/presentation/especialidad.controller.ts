import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CrearEspecialidadUseCase } from "../application/use-cases/crear-especialidad.use-case";
import { CrearEspecialidadDto } from "../infrastructure/dto/crearEspecialidad.dto";

@Controller('especialidades')
export class EspecialidadController{
    constructor(
        private readonly crearEspecialidadUseCase: CrearEspecialidadUseCase
    ){}

    @Post()
    async crearEspecialidad (@Body() dto: CrearEspecialidadDto){
        const result = await this.crearEspecialidadUseCase.ejecutar(dto)
        if(!result.ok){
            throw new BadRequestException(result.message)
        }

        return result.value;
    }
}