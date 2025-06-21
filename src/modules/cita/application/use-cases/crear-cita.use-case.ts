import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cita } from '../../domain/entities/cita.entity';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { CrearCitaDto } from '../../infrastructure/dto/crear-cita.dto';
import { CITA_REPOSITORY } from '../../cita.repository.token';
import { PACIENTE_REPOSITORY } from '../../../paciente/paciente.repository.token';
import { COLABORADOR_REPOSITORY } from '../../../colaborador/colaborador.repository.token'
import { SERVICIO_REPOSITORY } from '../../../servicio/servicio.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { ColaboradorRepository } from '../../../colaborador/domain/repositories/colaborador.repository';
import { ServicioRepository } from '../../../servicio/domain/repositories/servicio.repository';
import { Servicio } from '../../../servicio/domain/entities/servicio.entity';
import { PagoCita } from '../../../pago-cita/domain/entities/pago-cita.entity';


@Injectable()
export class CrearCitaUseCase {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepo: CitaRepository,

    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepo: PacienteRepository,

    @Inject(COLABORADOR_REPOSITORY)
    private readonly colaboradorRepo: ColaboradorRepository,

    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepo: ServicioRepository,
  ) {}

  async ejecutar(dto: CrearCitaDto): Promise<Cita> {
  const paciente = await this.pacienteRepo.buscarPorId(dto.paciente);
  const colaborador = await this.colaboradorRepo.buscarPorId(dto.colaborador);
  const servicios = await Promise.all(dto.servicios.map(id => this.servicioRepo.buscarPorId(id)));

  const pago = dto.pago ? new PagoCita(0, dto.pago.monto, dto.pago.fechaPago, dto.pago.metodoPago) : undefined;

  const cita = new Cita(
    null,
    dto.fechaCita,
    dto.horaCita,
    dto.estadoCita,
    dto.motivoCita,
    dto.diagnostico || '',
    paciente,
    colaborador,
    servicios,
    null,
    pago
  );

  if (pago) pago.cita = cita; // relación explícita

  return this.citaRepo.crear(cita);
}

}