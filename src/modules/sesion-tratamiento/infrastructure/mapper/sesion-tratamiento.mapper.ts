import { SesionTratamiento } from '../../domain/entities/sesion-tratamiento.entity';
import { SesionTratamientoOrmEntity } from '../database/sesion-tratamiento.orm-entity';
import { TratamientoOrmEntity } from 'src/modules/tratamiento/infrastructure/database/tratamiento.orm-entity';
import { TratamientoMapper } from 'src/modules/tratamiento/infrastructure/mapper/tratamiento.mapper';

export class SesionTratamientoMapper {
    static toDomain(sesion: SesionTratamientoOrmEntity): SesionTratamiento {
        return new SesionTratamiento({
            id: sesion.id,
            tratamiento: TratamientoMapper.toDomain(sesion.tratamiento),
            fecha: sesion.fecha,
            hora: sesion.hora,
            observaciones: sesion.observaciones ?? undefined,
            estado: sesion.estado
        });
    }

    static toOrmEntity(sesion: SesionTratamiento): SesionTratamientoOrmEntity {
        const sesionOrm = new SesionTratamientoOrmEntity();
        sesionOrm.id = sesion.getId();

        // Relación con Tratamiento
        const tratamiento = sesion.getTratamiento();
        const tratamientoOrm = new TratamientoOrmEntity();
        tratamientoOrm.id = tratamiento.getId();
        sesionOrm.tratamiento = tratamientoOrm;

        // Campos simples
        sesionOrm.fecha = sesion.getFecha();
        sesionOrm.hora = sesion.getHora();
        sesionOrm.observaciones = sesion.getObservaciones() ?? null;
        sesionOrm.estado = sesion.getEstado();

        return sesionOrm;
    }
}