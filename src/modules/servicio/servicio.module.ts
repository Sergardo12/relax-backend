import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioOrmEntity } from './infrastructure/database/servicio.orm-entity';
//import { CrearServicioUseCase } from './application/use-cases/crear-servicio.use-case';
import { SERVICIO_REPOSITORY } from './servicio.repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([ServicioOrmEntity])],
  /*controllers: [ServicioController],
  providers: [
    CrearServicioUseCase,
    {
      provide: SERVICIO_REPOSITORY,
      useClass: require('./infrastructure/repositories/servicio.repository.impl').ServicioRepositoryImpl,
    },
  ],*/
  exports: [ServicioModule],
})
export class ServicioModule {}
