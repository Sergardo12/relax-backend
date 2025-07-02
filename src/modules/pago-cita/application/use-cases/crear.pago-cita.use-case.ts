// import { Inject, Injectable, NotFoundException } from "@nestjs/common";
// import { PAGO_CITA_REPOSITORY } from "../../pago-cita.repository.token";
// import { PagoCitaRepository } from "../../domain/repository/pago-cita.repository";
// import { CrearPagoCitaDto } from "../../infrastructure/dto/crear.pago-cita.dto";
// import { PagoCita } from "../../domain/entities/pago-cita.entity";
// import { Cita } from "../../../cita/domain/entities/cita.entity";
// import { CITA_REPOSITORY } from "../../../cita/cita.repository.token";
// import { CitaRepository } from "../../../cita/domain/repositories/cita.repository"

// @Injectable()
// export class CrearPagoCitaUseCase {
//   constructor(
//     @Inject(PAGO_CITA_REPOSITORY)
//     private readonly pagoRepo: PagoCitaRepository,

//     @Inject(CITA_REPOSITORY)
//     private readonly citaRepo: CitaRepository
//   ) {}

//   async execute(dto: CrearPagoCitaDto): Promise<PagoCita> {
//     const cita = await this.citaRepo.buscarPorId(dto.citaId);
//     if (!cita) {
//       throw new NotFoundException(`Cita con ID ${dto.citaId} no encontrada`);
//     }

//     const pago = new PagoCita(0, dto.monto, dto.fechaPago, dto.metodoPago);
//     pago.cita = cita;

//     return await this.pagoRepo.crear(pago);
//   }
// }