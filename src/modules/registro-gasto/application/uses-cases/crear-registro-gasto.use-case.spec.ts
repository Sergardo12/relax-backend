/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProveedorInsumoRepository } from '../../../proveedor-insumo/domain/repositories/proveedor-insumo.repository';
import { PROVEEDOR_INSUMO_REPOSITORY } from '../../../proveedor-insumo/infrastructure/proveedor-insumo.repository.token';
import { RegistroGastoOrmEntity } from '../../infrastructure/database/registro-gasto.orm-entity';
import { DetalleGastoOrmEntity } from '../../infrastructure/database/detalle-gasto.orm-entity';
import { ProveedorInsumo } from '../../../proveedor-insumo/domain/entities/proveedor-insumo.entity';
import { CategoriaGasto, TipoComprobanteGasto } from '../../domain/enums/registro-gasto.enum';
import { CrearRegistroGastoDto } from '../../infrastructure/dto/crear-registro-gasto.dto';
import { CrearRegistroGastoUseCase } from './crear-registro.use-case';
import { Result } from 'src/common/types/result';

describe('CrearRegistroGastoUseCase', () => {
  // ================================================================
  // VARIABLES: Declaramos todas las dependencias que vamos a mockear
  // ================================================================
  let useCase: CrearRegistroGastoUseCase;
  let proveedorRepository: jest.Mocked<ProveedorInsumoRepository>;
  let gastoOrmRepository: jest.Mocked<Repository<RegistroGastoOrmEntity>>;
  let detalleOrmRepository: jest.Mocked<Repository<DetalleGastoOrmEntity>>;
  let dataSource: jest.Mocked<DataSource>;

  // ================================================================
  // MOCK DEL QUERY RUNNER (para transacciones)
  // ================================================================
  let mockQueryRunner: any;
    //  Silenciar console ANTES de todo
    beforeAll(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    //  Restaurar console DESPUÉS de todo
    afterAll(() => {
      jest.restoreAllMocks();
    });

  beforeEach(async () => {
    // ============================================================
    // ARRANGE: Configuramos los mocks antes de cada test
    // ============================================================

    // Mock del QueryRunner (maneja las transacciones)
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(), // Mock para guardar en la BD
        findOne: jest.fn(), // Mock para buscar en la BD
      },
    };

    // Mock del DataSource (crea el QueryRunner)
    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as any;

    // Mock del Repositorio de Proveedor
    proveedorRepository = {
      findById: jest.fn(),
    } as any;

    // Mock del Repositorio de Gasto (ORM)
    gastoOrmRepository = {
      findOne: jest.fn(),
    } as any;

    // Mock del Repositorio de Detalle (ORM)
    detalleOrmRepository = {} as any;

    // ============================================================
    // Creamos un módulo de testing de NestJS
    // ============================================================
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrearRegistroGastoUseCase,
        {
          provide: PROVEEDOR_INSUMO_REPOSITORY,
          useValue: proveedorRepository,
        },
        {
          provide: getRepositoryToken(RegistroGastoOrmEntity),
          useValue: gastoOrmRepository,
        },
        {
          provide: getRepositoryToken(DetalleGastoOrmEntity),
          useValue: detalleOrmRepository,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    // Obtenemos la instancia del Use Case
    useCase = module.get<CrearRegistroGastoUseCase>(CrearRegistroGastoUseCase);

    // Limpiamos todos los mocks antes de cada test
      jest.clearAllMocks();

  });

  // ================================================================
  // TEST 1: Crear gasto exitosamente ✅
  // ================================================================
  it('debe crear un gasto con detalles correctamente', async () => {
    // ============================================================
    // ARRANGE: Preparamos los datos de prueba
    // ============================================================

    // Mock del proveedor que existe
    const mockProveedor = new ProveedorInsumo({
      id: 'proveedor-123',
      nombre: 'Distribuidora XYZ',
      ruc: '20123456789',
      telefono: '987654321',
    });

    // DTO con los datos de entrada
    const dto: CrearRegistroGastoDto = {
      idProveedor: 'proveedor-123',
      fecha: '2025-11-07',
      categoria: CategoriaGasto.INSUMOS_MASAJE,
      tipoComprobante: TipoComprobanteGasto.FACTURA,
      numeroComprobante: 'F001-00123',
      observaciones: 'Compra de aceites',
      detalles: [
        {
          descripcion: 'Aceite de lavanda 1L',
          cantidad: 10,
          precioUnitario: 45.0,
        },
        {
          descripcion: 'Aceite de almendras 1L',
          cantidad: 5,
          precioUnitario: 38.0,
        },
      ],
    };

    // Mock del gasto guardado (lo que retorna la BD)
    const mockGastoGuardado = {
      id: 'gasto-123',
      proveedor: { id: 'proveedor-123' },
      fecha: new Date('2025-11-07'),
      categoria: CategoriaGasto.INSUMOS_MASAJE,
      tipoComprobante: TipoComprobanteGasto.FACTURA,
      numeroComprobante: 'F001-00123',
      total: 640.0, // (10 × 45) + (5 × 38) = 450 + 190 = 640
      observaciones: 'Compra de aceites',
      estado: 'registrado',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock del gasto completo con relaciones
    const mockGastoCompleto = {
      ...mockGastoGuardado,
      proveedor: {
        id: 'proveedor-123',
        nombre: 'Distribuidora XYZ',
        ruc: '20123456789',
        telefono: '987654321',
        email: null,
        direccion: null,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      detalles: [
        {
          id: 'detalle-1',
          descripcion: 'Aceite de lavanda 1L',
          cantidad: 10,
          precioUnitario: 45.0,
          subtotal: 450.0,
        },
        {
          id: 'detalle-2',
          descripcion: 'Aceite de almendras 1L',
          cantidad: 5,
          precioUnitario: 38.0,
          subtotal: 190.0,
        },
      ],
    };

    // ============================================================
    // Configuramos el comportamiento de los mocks
    // ============================================================

    // El proveedor existe
    proveedorRepository.findById.mockResolvedValue(
      Result.success(mockProveedor)
    );

    // El save del gasto retorna el gasto guardado
    mockQueryRunner.manager.save.mockResolvedValueOnce(mockGastoGuardado);

    // El save de cada detalle retorna OK (se llama 2 veces)
    mockQueryRunner.manager.save.mockResolvedValueOnce({ id: 'detalle-1' });
    mockQueryRunner.manager.save.mockResolvedValueOnce({ id: 'detalle-2' });

    // El findOne retorna el gasto completo con detalles
    gastoOrmRepository.findOne.mockResolvedValue(mockGastoCompleto as any);

    // ============================================================
    // ACT: Ejecutamos el caso de uso
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT: Verificamos que todo funcionó correctamente
    // ============================================================

    // 1. El resultado debe ser exitoso
    expect(result.ok).toBe(true);
    
    // 2. ⭐ Type narrowing: TypeScript ahora sabe que es success
    if (!result.ok) {
      throw new Error('Expected success result');
    }

    // 3. Ahora podemos acceder a result.value sin error
    expect(result.value).toBeDefined();
    expect(result.value.getTotal()).toBe(640.0);

    // 4. Verificamos que se llamó al repositorio de proveedor
    expect(proveedorRepository.findById).toHaveBeenCalledWith('proveedor-123');
    expect(proveedorRepository.findById).toHaveBeenCalledTimes(1);

    // 5. Verificamos que se inició la transacción
    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();

    // 6. Verificamos que se guardó el gasto (1 vez)
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      RegistroGastoOrmEntity,
      expect.any(Object)
    );

    // 7. Verificamos que se guardaron los detalles (2 veces)
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      DetalleGastoOrmEntity,
      expect.objectContaining({
        descripcion: 'Aceite de lavanda 1L',
        cantidad: 10,
        precioUnitario: 45.0,
        subtotal: 450.0,
      })
    );

    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      DetalleGastoOrmEntity,
      expect.objectContaining({
        descripcion: 'Aceite de almendras 1L',
        cantidad: 5,
        precioUnitario: 38.0,
        subtotal: 190.0,
      })
    );

    // 8. Verificamos que se hizo commit de la transacción
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();

    // 9. Verificamos que se liberó el QueryRunner
    expect(mockQueryRunner.release).toHaveBeenCalled();

    // 10. Verificamos que NO hubo rollback
    expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
  });

  // ================================================================
  // TEST 2: Proveedor no encontrado ❌
  // ================================================================
  it('debe retornar error cuando el proveedor no existe', async () => {
    // ============================================================
    // ARRANGE: Preparamos el escenario de error
    // ============================================================

    const dto: CrearRegistroGastoDto = {
      idProveedor: 'proveedor-inexistente',
      fecha: '2025-11-07',
      categoria: CategoriaGasto.INSUMOS_MASAJE,
      tipoComprobante: TipoComprobanteGasto.FACTURA,
      numeroComprobante: 'F001-00123',
      detalles: [
        {
          descripcion: 'Aceite de lavanda 1L',
          cantidad: 10,
          precioUnitario: 45.0,
        },
      ],
    };

    // El proveedor NO existe (retorna null)
    proveedorRepository.findById.mockResolvedValue(Result.success(null));

    // ============================================================
    // ACT: Ejecutamos el caso de uso
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT: Verificamos el error
    // ============================================================

    // 1. El resultado debe ser un error
    expect(result.ok).toBe(false);
    
    // 2. ⭐ Type narrowing: TypeScript ahora sabe que es failure
    if (result.ok) {
      throw new Error('Expected failure result');
    }

    // 3. Ahora podemos acceder a result.message sin error
    expect(result.message).toBe('Proveedor no encontrado');

    // 4. Verificamos que se buscó el proveedor
    expect(proveedorRepository.findById).toHaveBeenCalledWith(
      'proveedor-inexistente'
    );

    // 5. Verificamos que se inició la transacción
    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();

    // 6. Verificamos que se hizo ROLLBACK (no commit)
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();

    // 7. Verificamos que NO se guardó nada
    expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();

    // 8. Verificamos que se liberó el QueryRunner
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });

  // ================================================================
// TEST 3: Error al calcular total (cantidad inválida) ❌
// ================================================================
it('debe retornar error cuando la cantidad es menor o igual a 0', async () => {
  // ============================================================
  // ARRANGE: Preparamos datos inválidos
  // ============================================================

  const mockProveedor = new ProveedorInsumo({
    id: 'proveedor-123',
    nombre: 'Distribuidora XYZ',
    ruc: '20123456789',
    telefono: '987654321',
  });

  const dto: CrearRegistroGastoDto = {
    idProveedor: 'proveedor-123',
    fecha: '2025-11-07',
    categoria: CategoriaGasto.INSUMOS_MASAJE,
    tipoComprobante: TipoComprobanteGasto.FACTURA,
    numeroComprobante: 'F001-00123',
    detalles: [
      {
        descripcion: 'Aceite de lavanda 1L',
        cantidad: 0, // ❌ Cantidad inválida
        precioUnitario: 45.0,
      },
    ],
  };

  proveedorRepository.findById.mockResolvedValue(
    Result.success(mockProveedor)
  );

  // ============================================================
  // ACT: Ejecutamos el caso de uso
  // ============================================================
  const result = await useCase.execute(dto);

  // ============================================================
  // ASSERT: Verificamos el error
  // ============================================================

  // 1. El resultado debe ser un error
  expect(result.ok).toBe(false);

  // 2. Type narrowing
  if (result.ok) {
    throw new Error('Expected failure result');
  }

  // 3. Verificamos el mensaje de error
  expect(result.message).toBe('Error al crear el registro de gasto');
  expect(result.error).toBeDefined();

  // 4. Verificamos que el error interno es el correcto
  const error = result.error as Error;
  expect(error.message).toBe('La cantidad debe ser mayor a 0');

  // 5. Verificamos que hubo rollback
  expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();

  // 6. Verificamos que se liberó el QueryRunner
  expect(mockQueryRunner.release).toHaveBeenCalled();

  // 7. Verificamos que NO se guardó nada
  expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
});

  // ================================================================
  // TEST 4: Error al guardar en base de datos ❌
  // ================================================================
  it('debe hacer rollback cuando falla al guardar el gasto', async () => {
    // ============================================================
    // ARRANGE: Simulamos error en la BD
    // ============================================================

    const mockProveedor = new ProveedorInsumo({
      id: 'proveedor-123',
      nombre: 'Distribuidora XYZ',
      ruc: '20123456789',
      telefono: '987654321',
    });

    const dto: CrearRegistroGastoDto = {
      idProveedor: 'proveedor-123',
      fecha: '2025-11-07',
      categoria: CategoriaGasto.INSUMOS_MASAJE,
      tipoComprobante: TipoComprobanteGasto.FACTURA,
      numeroComprobante: 'F001-00123',
      detalles: [
        {
          descripcion: 'Aceite de lavanda 1L',
          cantidad: 10,
          precioUnitario: 45.0,
        },
      ],
    };

    proveedorRepository.findById.mockResolvedValue(
      Result.success(mockProveedor)
    );

    // Simulamos error al guardar
    mockQueryRunner.manager.save.mockRejectedValue(
      new Error('Error de base de datos')
    );

    // ============================================================
    // ACT: Ejecutamos el caso de uso
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT: Verificamos el manejo del error
    // ============================================================

    // 1. El resultado debe ser un error
    expect(result.ok).toBe(false);
    
    // 2. ⭐ Type narrowing
    if (result.ok) {
      throw new Error('Expected failure result');
    }

    // 3. Ahora podemos acceder a result.message
    expect(result.message).toBe('Error al crear el registro de gasto');

    // 4. Verificamos que se hizo rollback
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();

    // 5. Verificamos que se liberó el QueryRunner
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });

  // ================================================================
  // TEST 5: Cálculo correcto del total con múltiples detalles ✅
  // ================================================================
  it('debe calcular correctamente el total con múltiples detalles', async () => {
    // ============================================================
    // ARRANGE: Preparamos datos con varios detalles
    // ============================================================

    const mockProveedor = new ProveedorInsumo({
      id: 'proveedor-123',
      nombre: 'Distribuidora XYZ',
      ruc: '20123456789',
      telefono: '987654321',
    });

    const dto: CrearRegistroGastoDto = {
      idProveedor: 'proveedor-123',
      fecha: '2025-11-07',
      categoria: CategoriaGasto.PRODUCTOS_LIMPIEZA,
      tipoComprobante: TipoComprobanteGasto.BOLETA,
      numeroComprobante: 'B001-00456',
      detalles: [
        {
          descripcion: 'Desinfectante 5L',
          cantidad: 4,
          precioUnitario: 28.0,
        },
        {
          descripcion: 'Toallas descartables x100',
          cantidad: 10,
          precioUnitario: 15.0,
        },
        {
          descripcion: 'Jabón líquido 1L',
          cantidad: 6,
          precioUnitario: 12.5,
        },
      ],
    };

    // Total esperado: (4×28) + (10×15) + (6×12.5) = 112 + 150 + 75 = 337
    const totalEsperado = 337.0;

    const mockGastoGuardado = {
      id: 'gasto-456',
      total: totalEsperado,
    };

    const mockGastoCompleto = {
      ...mockGastoGuardado,
      proveedor: {
        id: 'proveedor-123',
        nombre: 'Distribuidora XYZ',
        ruc: '20123456789',
        telefono: '987654321',
        email: null,
        direccion: null,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      fecha: new Date('2025-11-07'),
      categoria: CategoriaGasto.PRODUCTOS_LIMPIEZA,
      tipoComprobante: TipoComprobanteGasto.BOLETA,
      numeroComprobante: 'B001-00456',
      estado: 'registrado',
      observaciones: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      detalles: dto.detalles.map((d, i) => ({
        id: `detalle-${i}`,
        ...d,
        subtotal: d.cantidad * d.precioUnitario,
      })),
    };

    proveedorRepository.findById.mockResolvedValue(
      Result.success(mockProveedor)
    );
    mockQueryRunner.manager.save.mockResolvedValue(mockGastoGuardado);
    gastoOrmRepository.findOne.mockResolvedValue(mockGastoCompleto as any);

    // ============================================================
    // ACT: Ejecutamos el caso de uso
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT: Verificamos el cálculo
    // ============================================================

    expect(result.ok).toBe(true);
    
    // ⭐ Type narrowing
    if (!result.ok) {
      throw new Error('Expected success result');
    }

    expect(result.value.getTotal()).toBe(totalEsperado);

    // Verificamos que se guardaron 3 detalles
    expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(4); // 1 gasto + 3 detalles
  });
});