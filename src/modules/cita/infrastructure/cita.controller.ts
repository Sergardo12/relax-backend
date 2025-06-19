import { Body, Controller, Post } from "@nestjs/common";
import { CrearCitaUseCase } from "../application/use-cases/crear-cita.use-case";
import { CrearCitaDto } from "./dto/crear-cita.dto";


@Controller('cita')
export class CitaController{
    constructor(private readonly crearCitaUseCase: CrearCitaUseCase){}

    @Post()
    async crearCita(@Body() dto: CrearCitaDto){
        return await this.crearCitaUseCase.ejecutar(dto)
    }
}