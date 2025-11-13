import { Injectable, Inject } from '@nestjs/common';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { CITA_REPOSITORY } from '../../../cita/infrastructure/cita.repository.token';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';
import { SuscripcionRepository } from '../../../suscripcion/domain/repositories/suscripcion.repository';
import { MembresiaRepository } from '../../../membresia/domain/repositories/membresia.repository';
import { SUSCRIPCION_REPOSITORY_TOKEN } from 'src/modules/suscripcion/infrastructure/suscripcion.repository.token';
import { MEMBRESIA_REPOSITORY_TOKEN } from 'src/modules/membresia/infrastructure/membresia.repository.token';
import { EstadoMembresia } from 'src/modules/membresia/domain/enum/membresia.enum';

@Injectable()
export class ChatbotFunctionsService {
  constructor(
    @Inject(CITA_REPOSITORY)
    private readonly citaRepository: CitaRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    @Inject(SUSCRIPCION_REPOSITORY_TOKEN)
    private readonly suscripcionRepository: SuscripcionRepository,
    @Inject(MEMBRESIA_REPOSITORY_TOKEN)
    private readonly membresiaRepository: MembresiaRepository,
  ) {}

  // ⭐ FUNCIÓN 1: Citas de hoy
  async getCitasHoy(): Promise<string> {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const citasResult = await this.citaRepository.findAll();
      
      if (!citasResult.ok) {
        return 'Error al obtener las citas';
      }

      const citasHoy = citasResult.value.filter(cita => {
        const fechaCita = new Date(cita.getFecha());
        fechaCita.setHours(0, 0, 0, 0);
        return fechaCita.getTime() === hoy.getTime();
      });

      return `Hoy hay ${citasHoy.length} citas programadas.`;
    } catch (error) {
      return 'Error al consultar las citas de hoy';
    }
  }

  // ⭐ FUNCIÓN 2: Total de pacientes
  async getTotalPacientes(): Promise<string> {
    try {
      const pacientesResult = await this.pacienteRepository.findAll();
      
      if (!pacientesResult.ok) {
        return 'Error al obtener los pacientes';
      }

      return `Hay un total de ${pacientesResult.value.length} pacientes registrados en el sistema.`;
    } catch (error) {
      return 'Error al consultar los pacientes';
    }
  }

  // ⭐ FUNCIÓN 3: Lista de nombres
  async getNombresPacientes(): Promise<string> {
    try {
      const pacientesResult = await this.pacienteRepository.findAll();
      
      if (!pacientesResult.ok) {
        return 'Error al obtener los pacientes';
      }

      const nombres = pacientesResult.value.map(p => 
        `${p.getNombres()} ${p.getApellidos()}`
      );

      return `Los pacientes registrados son: ${nombres.join(', ')}.`;
    } catch (error) {
      return 'Error al consultar los nombres de pacientes';
    }
  }

  // ⭐ FUNCIÓN 4: Pacientes con suscripción
  async getPacientesConSuscripcion(): Promise<string> {
    try {
      const suscripcionesResult = await this.suscripcionRepository.findAll();
      
      if (!suscripcionesResult.ok) {
        return 'Error al obtener las suscripciones';
      }

      const suscripcionesActivas = suscripcionesResult.value.filter(
        s => s.getEstado() === 'activa'
      );

      return `Hay ${suscripcionesActivas.length} pacientes con suscripción activa actualmente.`;
    } catch (error) {
      return 'Error al consultar las suscripciones';
    }
  }

  // ⭐ FUNCIÓN 5: Membresías disponibles
  async getMembresiasDisponibles(): Promise<string> {
    try {
      const membresiasResult = await this.membresiaRepository.findAll();
      
      if (!membresiasResult.ok) {
        return 'Error al obtener las membresías';
      }

      const membresiasActivas = membresiasResult.value.filter(
        m => m.getEstado() === EstadoMembresia.ACTIVA
      );

      const lista = membresiasActivas.map(m => 
        `${m.getNombre()} (${m.getDuracionDias()} días, S/. ${m.getPrecio()})`
      ).join(', ');

      return `Las membresías disponibles son: ${lista}.`;
    } catch (error) {
      return 'Error al consultar las membresías';
    }
  }

  async getDetallesSuscripciones(): Promise<string> {
  try {
    const suscripcionesResult = await this.suscripcionRepository.findAll();
    
    if (!suscripcionesResult.ok) {
      return 'Error al obtener las suscripciones';
    }

    const suscripcionesActivas = suscripcionesResult.value.filter(
      s => s.getEstado() === 'activa'
    );

    if (suscripcionesActivas.length === 0) {
      return 'No hay pacientes con suscripción activa en este momento.';
    }

    const detalles = suscripcionesActivas.map(suscripcion => {
      const paciente = suscripcion.getPaciente();
      const membresia = suscripcion.getMembresia();
      const nombreCompleto = `${paciente.getNombres()} ${paciente.getApellidos()}`;
      const nombreMembresia = membresia.getNombre();
      
      return `${nombreCompleto} está suscrito a ${nombreMembresia}`;
    });

    return `Hay ${suscripcionesActivas.length} pacientes con suscripción activa: ${detalles.join(', ')}.`;
  } catch (error) {
    console.error('Error en getDetallesSuscripciones:', error);
    return 'Error al consultar los detalles de las suscripciones';
  }
}

  // ⭐ DICCIONARIO DE FUNCIONES
  getFunctions() {
    return {
      getCitasHoy: this.getCitasHoy.bind(this),
      getTotalPacientes: this.getTotalPacientes.bind(this),
      getNombresPacientes: this.getNombresPacientes.bind(this),
      getPacientesConSuscripcion: this.getPacientesConSuscripcion.bind(this),
      getMembresiasDisponibles: this.getMembresiasDisponibles.bind(this),
      getDetallesSuscripciones: this.getDetallesSuscripciones.bind(this)
    };
  }

  // ⭐ DEFINICIONES PARA OPENAI
 getToolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'getCitasHoy',
        description: 'Obtiene el número de citas programadas para el día de hoy. Úsala cuando pregunten por citas de hoy, agenda de hoy, o reservas del día.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'getTotalPacientes',
        description: 'Obtiene el número total de pacientes registrados en el sistema. Úsala cuando pregunten cuántos pacientes hay, total de clientes, o cantidad de pacientes.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'getNombresPacientes',
        description: 'Obtiene la lista COMPLETA con los nombres y apellidos de TODOS los pacientes registrados en el sistema. Úsala cuando pregunten por nombres de pacientes, lista de pacientes, quiénes son los pacientes, nombres completos, o cualquier consulta sobre identificar pacientes.', // ⭐ MÁS CLARO
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'getPacientesConSuscripcion',
        description: 'Obtiene cuántos pacientes tienen una suscripción o membresía activa. Úsala cuando pregunten por pacientes suscritos, clientes con membresía, o suscripciones activas.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
     {
      type: 'function',
      function: {
        name: 'getDetallesSuscripciones',
        description: 'Obtiene la lista COMPLETA de pacientes con suscripción activa, incluyendo sus NOMBRES, la MEMBRESÍA a la que están suscritos, y las fechas de vigencia. Úsala cuando pregunten quiénes están suscritos, a qué membresías, nombres de los suscritos, o cualquier detalle sobre las suscripciones activas.', // ⭐ NUEVA
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'getMembresiasDisponibles',
        description: 'Obtiene la lista de membresías o planes disponibles con sus precios y duración. Úsala cuando pregunten por planes, membresías, precios de membresías, o qué paquetes ofrecen.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
    },
  ];
}
}