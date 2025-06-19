import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioOrmEntity } from './infrastructure/database/servicio.orm-entity';
import { CrearServicioUseCase } from './application/use-cases/crear-servicio.use-case';
import { SERVICIO_REPOSITORY } from './servicio.repository.token';
import { ServicioRepositoryImpl } from './infrastructure/repositories/servicio.repository.impl';
import { ServicioController } from './infrastructure/servicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServicioOrmEntity])],
  controllers: [ServicioController],
  providers: [
    CrearServicioUseCase,
    {
      provide: SERVICIO_REPOSITORY,
      useClass: ServicioRepositoryImpl
    },
  ],
  exports: [ServicioModule, SERVICIO_REPOSITORY],
})
export class ServicioModule {}
