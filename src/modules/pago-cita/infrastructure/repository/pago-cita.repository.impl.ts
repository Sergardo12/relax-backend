import { InjectRepository } from '@nestjs/typeorm';
import { PagoCitaOrmEntity } from '../database/pago-cita.orm-entity';
import { Repository } from 'typeorm';
import { PagoCitaRepository } from '../../domain/repository/pago-cita.repository';
import { PagoCita } from '../../domain/entities/pago-cita.entity';
import { PagoCitaMapper } from '../mappers/pago-cita.mapper';

export class PagoCitaRepositoryImpl implements PagoCitaRepository {
  constructor(
    @InjectRepository(PagoCitaOrmEntity)
    private readonly pagoRepo: Repository<PagoCitaOrmEntity>,
  ) {}

  async crear(pagoCita: PagoCita): Promise<PagoCita> {
    const ormEntity = PagoCitaMapper.toOrmEntity(pagoCita);
    const guardadoOrmEntity = await this.pagoRepo.save(ormEntity);
    return PagoCitaMapper.toDomain(guardadoOrmEntity);
  }

  async obtenerPorId(id: number): Promise<PagoCita | null> {
    const pago = await this.pagoRepo.findOne({
      where: { id },
      relations: ['cita'],
    });
    return pago ? PagoCitaMapper.toDomain(pago) : null;
  }
}