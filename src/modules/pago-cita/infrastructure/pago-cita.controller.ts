import { Body, Controller, Post } from "@nestjs/common";
import { PagoCita } from "../domain/entities/pago-cita.entity";
import { CrearPagoCitaDto } from "./dto/crear.pago-cita.dto";

@Controller('pagos-cita')
export class PagoCitaController{}