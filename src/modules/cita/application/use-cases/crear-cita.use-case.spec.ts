/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CrearCitaUseCase } from './crear-cita.use-case';
import { PacienteRepository } from '../../../paciente/domain/repositories/paciente.repository';
import { CitaRepository } from '../../domain/repositories/cita.repository';
import { PACIENTE_REPOSITORY } from '../../../paciente/infrastructure/paciente.repository.token';
import { CITA_REPOSITORY } from '../../infrastructure/cita.repository.token';
import { CitaService } from '../services/cita.service';
import { Paciente } from '../../../paciente/domain/entities/paciente.entity';
import { Usuario } from '../../../usuario/domain/entities/usuario.entity';
import { Rol } from '../../../rol/domain/entities/rol.entity';
import { Result } from '../../../../common/types/result';
import { CrearCitaDto } from '../../infrastructure/dto/crear-cita.dto';
import { CitaEstado } from '../../domain/enums/cita.enum';

describe('CrearCitaUseCase', () => {
  // ================================================================
  // VARIABLES
  // ================================================================
  let useCase: CrearCitaUseCase;
  let pacienteRepository: jest.Mocked<PacienteRepository>;
  let citaRepository: jest.Mocked<CitaRepository>;
  let citaService: jest.Mocked<CitaService>;

  // ================================================================
  // SILENCIAR LOGS
  // ================================================================
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    // ============================================================
    // MOCKS
    // ============================================================
    pacienteRepository = {
      findById: jest.fn(),
    } as any;

    citaRepository = {
      create: jest.fn(),
    } as any;

    citaService = {
      validarFechaFutura: jest.fn(),
      validarHorarioLaboral: jest.fn(),
    } as any;

    // ============================================================
    // CREAR MÓDULO DE TESTING
    // ============================================================
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrearCitaUseCase,
        {
          provide: PACIENTE_REPOSITORY,
          useValue: pacienteRepository,
        },
        {
          provide: CITA_REPOSITORY,
          useValue: citaRepository,
        },
        {
          provide: CitaService,
          useValue: citaService,
        },
      ],
    }).compile();

    useCase = module.get<CrearCitaUseCase>(CrearCitaUseCase);
    jest.clearAllMocks();
  });

  // ================================================================
  // TEST 1: Crear cita exitosamente ✅
  // ================================================================
  it('debe crear una cita exitosamente', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    // Mock del rol
    const mockRol = new Rol({
      id: 'rol-123',
      nombre: 'Paciente',
      descripcion: 'Rol de paciente',
    });

    // Mock del usuario
    const mockUsuario = new Usuario({
      id: 'usuario-123',
      correo: 'maria@example.com',
      contraseña: 'hashedPassword',
      rol: mockRol,
    });

    // Mock del paciente
    const mockPaciente = new Paciente({
      id: 'paciente-123',
      usuario: mockUsuario,
      nombres: 'María',
      apellidos: 'González',
      dni: '12345678',
      fechaNacimiento: new Date('1990-05-15'),
      telefono: '987654321',
    });

    // DTO de entrada
    const dto: CrearCitaDto = {
      idPaciente: 'paciente-123',
      fecha: '2025-11-15',
      hora: '15:00',
    };

    // Mock de cita creada
    const mockCitaCreada = {
      id: 'cita-abc',
      paciente: mockPaciente,
      fecha: new Date('2025-11-15T12:00:00'),
      hora: '15:00',
      estado: CitaEstado.PENDIENTE,
      estadoPago: 'pendiente',
    };

    // ============================================================
    // CONFIGURAR MOCKS
    // ============================================================

    // El paciente existe
    pacienteRepository.findById.mockResolvedValue(
      Result.success(mockPaciente)
    );

    // Validaciones pasan
    citaService.validarFechaFutura.mockReturnValue(true);
    citaService.validarHorarioLaboral.mockReturnValue(true);

    // Se crea la cita correctamente
    citaRepository.create.mockResolvedValue(
      Result.success(mockCitaCreada as any)
    );

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.ejecutar(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    // 1. El resultado debe ser exitoso
    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error('Expected success result');
    }

    // 2. Verificar que se buscó el paciente
    expect(pacienteRepository.findById).toHaveBeenCalledWith('paciente-123');
    expect(pacienteRepository.findById).toHaveBeenCalledTimes(1);

    // 3. Verificar que se validó la fecha
    expect(citaService.validarFechaFutura).toHaveBeenCalledWith(
      expect.any(Date)
    );

    // 4. Verificar que se validó el horario
    expect(citaService.validarHorarioLaboral).toHaveBeenCalledWith('15:00');

    // 5. Verificar que se creó la cita
    expect(citaRepository.create).toHaveBeenCalledWith(
      expect.any(Object)
    );
    expect(citaRepository.create).toHaveBeenCalledTimes(1);
  });

  // ================================================================
  // TEST 2: Paciente no encontrado ❌
  // ================================================================
  it('debe retornar error cuando el paciente no existe', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const dto: CrearCitaDto = {
      idPaciente: 'paciente-inexistente',
      fecha: '2025-11-15',
      hora: '15:00',
    };

    // Paciente no existe (null)
    pacienteRepository.findById.mockResolvedValue(
      { ok: true, value: null } as any
    );

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.ejecutar(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toBe('El paciente especificado no existe');

    // Verificar que se buscó el paciente
    expect(pacienteRepository.findById).toHaveBeenCalledWith(
      'paciente-inexistente'
    );

    // No se creó la cita
    expect(citaRepository.create).not.toHaveBeenCalled();

    // No se hicieron validaciones
    expect(citaService.validarFechaFutura).not.toHaveBeenCalled();
    expect(citaService.validarHorarioLaboral).not.toHaveBeenCalled();
  });

  // ================================================================
  // TEST 3: Fecha no es futura ❌
  // ================================================================
  it('debe retornar error cuando la fecha no es futura', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockRol = new Rol({
      id: 'rol-123',
      nombre: 'Paciente',
      descripcion: 'Rol de paciente',
    });

    const mockUsuario = new Usuario({
      id: 'usuario-123',
      correo: 'maria@example.com',
      contraseña: 'hashedPassword',
      rol: mockRol,
    });

    const mockPaciente = new Paciente({
      id: 'paciente-123',
      usuario: mockUsuario,
      nombres: 'María',
      apellidos: 'González',
      dni: '12345678',
      fechaNacimiento: new Date('1990-05-15'),
      telefono: '987654321',
    });

    const dto: CrearCitaDto = {
      idPaciente: 'paciente-123',
      fecha: '2020-01-01', // ⭐ Fecha pasada
      hora: '15:00',
    };

    // El paciente existe
    pacienteRepository.findById.mockResolvedValue(
      Result.success(mockPaciente)
    );

    // La fecha NO es futura
    citaService.validarFechaFutura.mockReturnValue(false);

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.ejecutar(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toBe('La fecha de la cita debe ser futura');

    // Verificar que se validó la fecha
    expect(citaService.validarFechaFutura).toHaveBeenCalled();

    // No se creó la cita
    expect(citaRepository.create).not.toHaveBeenCalled();

    // No se validó el horario (porque ya falló en fecha)
    expect(citaService.validarHorarioLaboral).not.toHaveBeenCalled();
  });

  // ================================================================
  // TEST 4: Horario fuera del horario laboral ❌
  // ================================================================
  it('debe retornar error cuando el horario está fuera del horario laboral', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockRol = new Rol({
      id: 'rol-123',
      nombre: 'Paciente',
      descripcion: 'Rol de paciente',
    });

    const mockUsuario = new Usuario({
      id: 'usuario-123',
      correo: 'maria@example.com',
      contraseña: 'hashedPassword',
      rol: mockRol,
    });

    const mockPaciente = new Paciente({
      id: 'paciente-123',
      usuario: mockUsuario,
      nombres: 'María',
      apellidos: 'González',
      dni: '12345678',
      fechaNacimiento: new Date('1990-05-15'),
      telefono: '987654321',
    });

    const dto: CrearCitaDto = {
      idPaciente: 'paciente-123',
      fecha: '2025-11-15',
      hora: '23:00', // ⭐ Fuera del horario (8AM-10PM)
    };

    // El paciente existe
    pacienteRepository.findById.mockResolvedValue(
      Result.success(mockPaciente)
    );

    // La fecha es futura
    citaService.validarFechaFutura.mockReturnValue(true);

    // El horario NO es válido
    citaService.validarHorarioLaboral.mockReturnValue(false);

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.ejecutar(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toBe(
      'La hora debe estar dentro del horario laboral (8:00 AM - 10:00 PM)'
    );

    // Verificar que se validó el horario
    expect(citaService.validarHorarioLaboral).toHaveBeenCalledWith('23:00');

    // No se creó la cita
    expect(citaRepository.create).not.toHaveBeenCalled();
  });
});