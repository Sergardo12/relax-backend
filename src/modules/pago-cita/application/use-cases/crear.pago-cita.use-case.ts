import { Inject, Injectable } from "@nestjs/common";
import { PAGO_CITA_REPOSITORY } from "../../pago-cita.repository.token";
import { PagoCitaRepository } from "../../domain/repository/pago-cita.repository";
import { CrearPagoCitaDto } from "../../infrastructure/dto/crear.pago-cita.dto";
import { PagoCita } from "../../domain/entities/pago-cita.entity";
import { Cita } from "../../../cita/domain/entities/cita.entity";

@Injectable()
export class CrearPagoCitaUseCase {
  constructor(
    @Inject(PAGO_CITA_REPOSITORY)
    private readonly pagoRepo: PagoCitaRepository
  ) {}

  async execute(dto: CrearPagoCitaDto): Promise<PagoCita> {
    const cita = new Cita(dto.cita); // Solo ID
    const pago = new PagoCita(0, dto.monto, cita, dto.fechaPago, dto.metodoPago);
    return await this.pagoRepo.crear(pago);
  }
}