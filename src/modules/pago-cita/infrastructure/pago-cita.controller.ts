import { CrearPagoCitaUseCase } from "../application/use-cases/crear.pago-cita.use-case";
import { Body, Controller, Post } from "@nestjs/common";
import { PagoCita } from "../domain/entities/pago-cita.entity";
import { CrearPagoCitaDto } from "./dto/crear.pago-cita.dto";

@Controller('pagos-cita')
export class PagoCitaController{
    constructor (
        private readonly crearPagoCitaUseCase: CrearPagoCitaUseCase
    ){}

    @Post()
    async crearPagoCita(@Body() dto: CrearPagoCitaDto): Promise<PagoCita>{
        return await this.crearPagoCitaUseCase.execute(dto)
    }
}