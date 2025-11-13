import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CrearServicioUseCase } from "../application/use-case/crear-servicio.use-case";
import { CrearServicioDto } from "../infrastructure/dto/crear-servicio.dto";
import { ObtenerServicioPorEspecialidadUseCase } from "../application/use-case/obtener-servicio-por-especialidad.use-case";
import { error } from "console";

@Controller('servicio')
export class ServicioController{
    constructor(
        private readonly crearServicioUseCase: CrearServicioUseCase,
        private readonly obtenerServiciosPorEspecialidad: ObtenerServicioPorEspecialidadUseCase
    ){}

    @Post()
    async crearServicio(@Body() dto: CrearServicioDto){
        const result = await this.crearServicioUseCase.ejecutar(dto)
        if (!result.ok){ throw new BadRequestException(result.message)}
        return result.value

    }

    @Get('por-especialidad/:id')
    async obtenerServicioPorUnaEspecialidad(@Param('id') id: string) {
        const result = await this.obtenerServiciosPorEspecialidad.ejecutar(id)
        if(!result.ok){
            throw new HttpException('Se ha detectado un error', HttpStatus.BAD_REQUEST)
        }
        return result.value
    }


}