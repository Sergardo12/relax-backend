import { CitaMapper } from 'src/modules/cita/infrastructure/mapper/cita.mapper';
import { Tratamiento } from '../../domain/entities/tratamiento.entity';

import { TratamientoOrmEntity } from '../database/tratamiento.orm-entity'
import { ColaboradorMapper } from 'src/modules/colaborador/infrastructure/mapper/colaborador.mapper';
import { PacienteMapper } from 'src/modules/paciente/infrastructure/mapper/paciente.mapper';
import { CitaOrmEntity } from 'src/modules/cita/infrastructure/database/cita-entity.orm';
import { ColaboradorOrmEntity } from 'src/modules/colaborador/infrastructure/database/colaborador.orm-entity';
import { PacienteOrmEntity } from 'src/modules/paciente/infrastructure/database/paciente.orm-entity';
export class TratamientoMapper {
    static toDomain(tratamiento: TratamientoOrmEntity): Tratamiento {
        return new Tratamiento({
            id: tratamiento.id,
            cita: tratamiento.cita ? CitaMapper.toDomain(tratamiento.cita) : undefined,
            colaborador: ColaboradorMapper.toDomain(tratamiento.colaborador),   
            paciente: PacienteMapper.toDomain(tratamiento.paciente),
            fechaInicio: tratamiento.fechaInicio,
            diagnostico: tratamiento.diagnostico,    
            tratamiento: tratamiento.tratamiento,
            presionArterial: tratamiento.presionArterial ?? undefined,
            pulso: tratamiento.pulso ??  undefined,
            temperatura: tratamiento.temperatura ?? undefined,
            peso: tratamiento.peso ?? undefined,
            saturacion: tratamiento.saturacion ?? undefined,
            sesionesTotales: tratamiento.sesionesTotales,
            sesionesRealizadas: tratamiento.sesionesRealizadas,
            fechaFin: tratamiento.fechaFin ?? undefined,
            precioTotal: Number(tratamiento.precioTotal),
            estado: tratamiento.estado
        });
    }
    
    static toOrmEntity(tratamiento: Tratamiento): TratamientoOrmEntity {
        const tratamientoOrm = new TratamientoOrmEntity();
        tratamientoOrm.id = tratamiento.getId();
        // Relaciones - solo asignamos IDs
       
        const cita = tratamiento.getCita();
        if (cita) {
            const citaOrm = new CitaOrmEntity();
            citaOrm.id = cita.getId();
            tratamientoOrm.cita = citaOrm;
        }
       

        const colaborador = tratamiento.getColaborador();
        if (colaborador){
            const colaboradorOrm = new ColaboradorOrmEntity();
            colaboradorOrm.id = colaborador.getId();
            tratamientoOrm.colaborador = colaboradorOrm;
        }

        const paciente = tratamiento.getPaciente();
        const pacienteOrm = new PacienteOrmEntity();
        pacienteOrm.id = paciente.getId();
        tratamientoOrm.paciente = pacienteOrm;
        

        // campos simples
        tratamientoOrm.fechaInicio = tratamiento.getFechaInicio();
        tratamientoOrm.diagnostico = tratamiento.getDiagnostico();
        tratamientoOrm.tratamiento = tratamiento.getTratamiento();
        tratamientoOrm.presionArterial = tratamiento.getPresionArterial() ?? null;
        tratamientoOrm.pulso = tratamiento.getPulso() ?? null;
        tratamientoOrm.temperatura = tratamiento.getTemperatura() ?? null;
        tratamientoOrm.peso = tratamiento.getPeso() ?? null;
        tratamientoOrm.saturacion = tratamiento.getSaturacion() ?? null;
        tratamientoOrm.sesionesTotales = tratamiento.getSesionesTotales();
        tratamientoOrm.sesionesRealizadas = tratamiento.getSesionesRealizadas();
        tratamientoOrm.fechaFin = tratamiento.getFechaFin() ?? null;
        tratamientoOrm.precioTotal = tratamiento.getPrecioTotal();
        tratamientoOrm.estado = tratamiento.getEstado();
        return tratamientoOrm;


    
    }
}