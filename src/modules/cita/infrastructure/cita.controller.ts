import { Body, Controller, Post } from "@nestjs/common";
import { CrearCitaUseCase } from "../application/use-cases/crear-cita.use-case";
import { CrearCitaDto } from "./dto/crear-cita.dto";


@Controller('cita')
export class CitaController {
  constructor(private readonly crearCitaUseCase: CrearCitaUseCase) {}

  @Post()
  async crearCita(@Body() dto: CrearCitaDto) {
    const cita = await this.crearCitaUseCase.ejecutar(dto);

    // 🔥 Romper la referencia circular ANTES de enviar
    if (cita.pago) {
      cita.pago.cita = undefined;
    }

    return cita;
  }
}