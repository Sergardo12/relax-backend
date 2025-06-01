import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaOrmEntity } from './infrastructure/database/cita.orm-entity';
//import { CitaController } from './infrastructure/cita.controller';
//import { CrearCitaUseCase } from './application/use-cases/crear-cita.use-case';
import { CITA_REPOSITORY } from './cita.repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([CitaOrmEntity])],
  /*controllers: [CitaController],
   providers: [
    CrearCitaUseCase,
    {
      provide: CITA_REPOSITORY,
      useClass: require('./infrastructure/repositories/cita.repository.impl').CitaRepositoryImpl,
    },
  ],*/
  exports: [CitaModule],
})
export class CitaModule {}
