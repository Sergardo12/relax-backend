import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembresiaModule } from '../membresia/membresia.module';
import { ServicioModule } from '../servicio/servicio.module';
import { BeneficioMembresiaOrmEntity } from './infrastructure/database/beneficio.membresia.orm-entity';
import { BeneficioMembresiaController } from './presentation/beneficio-membresia.controller';
import { BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN } from './infrastructure/beneficio-membresia.repository.token';
import { BeneficioMembresiaRepositoryImpl } from './infrastructure/repositories/beneficio-membresia.repository.impl';
import { CrearBeneficioMembresiaUseCase } from './application/uses-cases/crear-beneficio-membresia.use-case';
import { ListarBeneficiosPorMembresiaUseCase } from './application/uses-cases/listar-beneficios-por-membresia.use-case';
import { EliminarBeneficioMembresiaUseCase } from './application/uses-cases/eliminar-beneficio-membresia.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([BeneficioMembresiaOrmEntity]),
    MembresiaModule,
    ServicioModule,
  ],
  controllers: [BeneficioMembresiaController],
  providers: [
    {
      provide: BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN,
      useClass: BeneficioMembresiaRepositoryImpl,
    },
    CrearBeneficioMembresiaUseCase,
    ListarBeneficiosPorMembresiaUseCase,
    EliminarBeneficioMembresiaUseCase
  ],
  exports: [BENEFICIO_MEMBRESIA_REPOSITORY_TOKEN],
})
export class BeneficioMembresianModule {}
