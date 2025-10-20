import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { CrearServicioUseCase } from "../application/use-case/crear-servicio.use-case";
import { CrearServicioDto } from "../infrastructure/dto/crear-servicio.dto";

@Controller('servicio')
export class ServicioController{
    constructor(
        private readonly crearServicioUseCase: CrearServicioUseCase
    ){}

    @Post()
    async crearServicio(@Body() dto: CrearServicioDto){
        const result = await this.crearServicioUseCase.ejecutar(dto)
        if (!result.ok){ throw new BadRequestException(result.message)}
        return result.value

    }
}