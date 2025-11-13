/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrearVentaProductoUseCase } from './crear-venta-producto.use-case';
import { ProductoRepository } from '../../../producto/domain/repositories/producto.repository';
import { PRODUCTO_REPOSITORY } from '../../../producto/infrastructure/producto.repository.token';
import { VentaProductoOrmEntity } from '../../infrastructure/database/venta-producto.orm-entity';
import { DetalleVentaProductoOrmEntity } from '../../infrastructure/database/detalle-venta-producto.orm-entity';
import { Producto } from '../../../producto/domain/entities/producto.entity';
import { Result } from '../../../../common/types/result';
import { TipoComprobanteVenta, MetodoPagoVenta } from '../../domain/enums/venta-producto.enum';
import { CrearVentaProductoDto } from '../../infrastructure/dto/crear-venta-producto.dto';
import { EstadoProducto } from '../../../producto/domain/enums/producto.enum';

describe('CrearVentaProductoUseCase', () => {
  // ================================================================
  // VARIABLES
  // ================================================================
  let useCase: CrearVentaProductoUseCase;
  let productoRepository: jest.Mocked<ProductoRepository>;
  let ventaOrmRepository: jest.Mocked<Repository<VentaProductoOrmEntity>>;
  let detalleOrmRepository: jest.Mocked<Repository<DetalleVentaProductoOrmEntity>>;
  let dataSource: jest.Mocked<DataSource>;
  let mockQueryRunner: any;

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
    // MOCK DEL QUERY RUNNER
    // ============================================================
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        findOne: jest.fn(),
      },
    };

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as any;

    productoRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    ventaOrmRepository = {
      findOne: jest.fn(),
    } as any;

    detalleOrmRepository = {} as any;

    // ============================================================
    // CREAR MÓDULO DE TESTING
    // ============================================================
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrearVentaProductoUseCase,
        {
          provide: PRODUCTO_REPOSITORY,
          useValue: productoRepository,
        },
        {
          provide: getRepositoryToken(VentaProductoOrmEntity),
          useValue: ventaOrmRepository,
        },
        {
          provide: getRepositoryToken(DetalleVentaProductoOrmEntity),
          useValue: detalleOrmRepository,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    useCase = module.get<CrearVentaProductoUseCase>(CrearVentaProductoUseCase);
    jest.clearAllMocks();
  });

  // ================================================================
  // TEST 1: Crear venta exitosamente ✅
  // ================================================================
  it('debe crear una venta, disminuir stock y autogenerar número de comprobante', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    // Mock de productos con stock suficiente
    const mockProducto1 = new Producto({
        id: 'producto-1',
        nombre: 'Crema Hidratante Premium',
        descripcion: 'Crema facial',
        precioCosto: 25.0, 
        precioVenta: 35.0,  
        stock: 100,
        stockMinimo: 10,
        categoria: 'cosmeticos', 
        estado: EstadoProducto.ACTIVO,
    });
    const mockProducto2 = new Producto({
        id: 'producto-2',
        nombre: 'Aceite Aromático',
        descripcion: 'Aceite de lavanda',
        precioCosto: 20.0, // ✅
        precioVenta: 28.0,  // ✅
        stock: 50,
        stockMinimo: 5,
        categoria: 'aceites', // ✅ Agregar
        estado: EstadoProducto.ACTIVO,
    });

    // DTO de entrada
    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      clienteNombre: 'María González',
      clienteDocumento: '12345678',
      detalles: [
        {
          idProducto: 'producto-1',
          cantidad: 2,
        },
        {
          idProducto: 'producto-2',
          cantidad: 3,
        },
      ],
    };

    // Subtotal: (2 × 35) + (3 × 28) = 70 + 84 = 154
    // Base imponible: 154 / 1.18 = 130.51
    // IGV: 154 - 130.51 = 23.49
    // Total: 154

    const mockVentaGuardada = {
      id: 'venta-123',
      fecha: new Date('2025-11-07T12:00:00'),
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      numeroComprobante: 'B001-00000001', // Autogenerado
      metodoPago: MetodoPagoVenta.EFECTIVO,
      subtotal: 130.51,
      descuento: 0,
      igv: 23.49,
      total: 154.0,
      estado: 'completada',
      clienteNombre: 'María González',
      clienteDocumento: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockVentaCompleta = {
      ...mockVentaGuardada,
      detalles: [
        {
          id: 'detalle-1',
          producto: mockProducto1,
          cantidad: 2,
          precioUnitario: 35.0,
          subtotal: 70.0,
        },
        {
          id: 'detalle-2',
          producto: mockProducto2,
          cantidad: 3,
          precioUnitario: 28.0,
          subtotal: 84.0,
        },
      ],
    };

    // ============================================================
    // CONFIGURAR MOCKS
    // ============================================================

    // Los productos existen y tienen stock
    productoRepository.findById
      .mockResolvedValueOnce(Result.success(mockProducto1))
      .mockResolvedValueOnce(Result.success(mockProducto2));

    // No hay ventas previas (primera boleta)
    ventaOrmRepository.findOne.mockResolvedValueOnce(null);

    // Save de la venta
    mockQueryRunner.manager.save.mockResolvedValueOnce(mockVentaGuardada);

    // Save de los detalles
    mockQueryRunner.manager.save.mockResolvedValueOnce({ id: 'detalle-1' });
    mockQueryRunner.manager.save.mockResolvedValueOnce({ id: 'detalle-2' });

    // Update de stock funciona OK
    productoRepository.update
      .mockResolvedValueOnce(Result.success(mockProducto1))
      .mockResolvedValueOnce(Result.success(mockProducto2));

    // FindOne final retorna venta completa
    ventaOrmRepository.findOne.mockResolvedValueOnce(mockVentaCompleta as any);

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    // 1. El resultado debe ser exitoso
    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error('Expected success result');
    }

    // 2. Verificar totales
    expect(result.value.getTotal()).toBe(154.0);
    expect(result.value.getSubtotal()).toBeCloseTo(130.51, 1);
    expect(result.value.getIgv()).toBeCloseTo(23.49, 1);

    // 3. Verificar número autogenerado
    expect(result.value.getNumeroComprobante()).toBe('B001-00000001');

    // 4. Verificar que se buscaron los productos
    expect(productoRepository.findById).toHaveBeenCalledWith('producto-1');
    expect(productoRepository.findById).toHaveBeenCalledWith('producto-2');
    expect(productoRepository.findById).toHaveBeenCalledTimes(2);

    // 5. Verificar que se buscó la última venta (para generar número)
    expect(ventaOrmRepository.findOne).toHaveBeenCalledWith({
      where: { tipoComprobante: TipoComprobanteVenta.BOLETA },
      order: { numeroComprobante: 'DESC' },
    });

    // 6. Verificar transacción
    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();

    // 7. Verificar que se guardó la venta y detalles
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      VentaProductoOrmEntity,
      expect.any(Object)
    );
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
      DetalleVentaProductoOrmEntity,
      expect.any(Object)
    );
    expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(3); // 1 venta + 2 detalles

    // 8. Verificar que se actualizó el stock (2 veces)
    expect(productoRepository.update).toHaveBeenCalledTimes(2);
  });

  // ================================================================
  // TEST 2: Stock insuficiente ❌
  // ================================================================
    it('debe retornar error cuando el stock es insuficiente', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockProducto = new Producto({
    id: 'producto-1',
    nombre: 'Crema Hidratante Premium',
    descripcion: 'Crema facial',
    precioCosto: 25.0, // ✅
    precioVenta: 35.0,  // ✅
    stock: 5,
    stockMinimo: 10,
    categoria: 'cosmeticos', // ✅
    estado: EstadoProducto.ACTIVO,
    });

    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      detalles: [
        {
          idProducto: 'producto-1',
          cantidad: 10, 
        },
      ],
    };

    productoRepository.findById.mockResolvedValue(Result.success(mockProducto));

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toContain('Stock insuficiente');
    expect(result.message).toContain('Crema Hidratante Premium');
    expect(result.message).toContain('Disponible: 5');
    expect(result.message).toContain('Solicitado: 10');

    // Verificar rollback
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();

    // No se guardó nada
    expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
    expect(productoRepository.update).not.toHaveBeenCalled();
  });

  // ================================================================
  // TEST 3: Producto no encontrado ❌
  // ================================================================
  it('debe retornar error cuando el producto no existe', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      detalles: [
        {
          idProducto: 'producto-inexistente',
          cantidad: 1,
        },
      ],
    };

    productoRepository.findById.mockResolvedValue(Result.success(null));

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toContain('Producto');
    expect(result.message).toContain('no encontrado');

    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
  });

  // ================================================================
  // TEST 4: Producto inactivo ❌
  // ================================================================
  it('debe retornar error cuando el producto está inactivo', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockProducto = new Producto({
    id: 'producto-1',
    nombre: 'Crema Hidratante Premium',
    descripcion: 'Crema facial',
    precioCosto: 25.0, // ✅
    precioVenta: 35.0,  // ✅
    stock: 100,
    stockMinimo: 10,
    categoria: 'cosmeticos', // ✅
    estado: EstadoProducto.INACTIVO,
    });

    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      detalles: [
        {
          idProducto: 'producto-1',
          cantidad: 1,
        },
      ],
    };

    productoRepository.findById.mockResolvedValue(Result.success(mockProducto));

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);

    // ============================================================
    // ASSERT
    // ============================================================

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected failure result');
    }

    expect(result.message).toContain('no está disponible');
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
  });

  // ================================================================
  // TEST 5: Numeración correlativa ✅
  // ================================================================
  it('debe generar números de comprobante correlativos', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockProducto = new Producto({
      id: 'producto-1',
      nombre: 'Crema Hidratante Premium',
      descripcion: 'Crema facial',
      precioCosto: 25.0,
      precioVenta: 35.0,
      stock: 100,
      stockMinimo: 10,
      categoria: 'cosmeticos',
      estado: EstadoProducto.ACTIVO,
    });

    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      detalles: [
        {
          idProducto: 'producto-1',
          cantidad: 1,
        },
      ],
    };

    // Ya existe una boleta B001-00000005
    const ultimaVenta = {
      numeroComprobante: 'B001-00000005',
    };

    const mockVentaGuardada = {
      id: 'venta-456',
      fecha: new Date('2025-11-07T12:00:00'),
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      numeroComprobante: 'B001-00000006', // ⭐ Siguiente número
      metodoPago: MetodoPagoVenta.EFECTIVO,
      subtotal: 29.66,
      descuento: 0,
      igv: 5.34,
      total: 35.0,
      estado: 'completada',
      clienteNombre: null,
      clienteDocumento: null,
      observaciones: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockVentaCompleta = {
      ...mockVentaGuardada,
      detalles: [
        {
      id: 'detalle-1',
      producto: {
        id: mockProducto.getId(),
        nombre: mockProducto.getNombre(),
        descripcion: mockProducto.getDescripcion(),
        precioCosto: 25.0,
        precioVenta: 35.0,
        stock: 99, // Stock después de la venta
        stockMinimo: 10,
        categoria: 'cosmeticos',
        estado: 'activo',
        fechaVencimiento: null,
        lote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      cantidad: 1,
      precioUnitario: 35.0,
      subtotal: 35.0,
    },
      ],
    };

    productoRepository.findById.mockResolvedValue(Result.success(mockProducto));
    ventaOrmRepository.findOne
      .mockResolvedValueOnce(ultimaVenta as any) // Primera llamada: buscar última
      .mockResolvedValueOnce(mockVentaCompleta as any); // Segunda llamada: recargar
    mockQueryRunner.manager.save.mockResolvedValue(mockVentaGuardada);
    productoRepository.update.mockResolvedValue(Result.success(mockProducto));

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);
    console.log('🔍 TEST 5 RESULT:', result);

    // ============================================================
    // ASSERT
    // ============================================================

    if (!result.ok){
      console.log('❌ ERROR TEST 5:', result.message)
      console.log('❌ ERROR DETAIL:', result.error)
    }
    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error('Expected success result');
    }

    // El número debe ser el siguiente (00000006)
    expect(result.value.getNumeroComprobante()).toBe('B001-00000006');
  });

  // ================================================================
  // TEST 6: Cálculo correcto del IGV ✅
  // ================================================================
  it('debe calcular correctamente el IGV incluido en el precio', async () => {
    // ============================================================
    // ARRANGE
    // ============================================================

    const mockProducto = new Producto({
      id: 'producto-1',
      nombre: 'Producto Test',
      descripcion: 'Test',
      precioCosto: 80.0,
      precioVenta: 118.0, // Precio con IGV incluido
      stock: 100,
      stockMinimo: 10,
      categoria: 'varios',
      estado: EstadoProducto.ACTIVO,
    });

    const dto: CrearVentaProductoDto = {
      fecha: '2025-11-07',
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      metodoPago: MetodoPagoVenta.EFECTIVO,
      detalles: [
        {
          idProducto: 'producto-1',
          cantidad: 1,
        },
      ],
    };

    // Total: 118
    // Base: 118 / 1.18 = 100
    // IGV: 118 - 100 = 18

    const mockVentaGuardada = {
      id: 'venta-789',
      fecha: new Date('2025-11-07T12:00:00'),
      tipoComprobante: TipoComprobanteVenta.BOLETA,
      numeroComprobante: 'B001-00000001',
      metodoPago: MetodoPagoVenta.EFECTIVO,
      subtotal: 100.0,
      descuento: 0,
      igv: 18.0,
      total: 118.0,
      estado: 'completada',
      clienteNombre: null,
      clienteDocumento: null,
      observaciones: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockVentaCompleta = {
      ...mockVentaGuardada,
      detalles: [
        {
      id: 'detalle-1',
      producto: {
        id: mockProducto.getId(),
        nombre: mockProducto.getNombre(),
        descripcion: mockProducto.getDescripcion(),
        precioCosto: 80.0,
        precioVenta: 118.0,
        stock: 99, // Stock después de la venta
        stockMinimo: 10,
        categoria: 'varios',
        estado: 'activo',
        fechaVencimiento: null,
        lote: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      cantidad: 1,
      precioUnitario: 118.0,
      subtotal: 118.0,
    },
      ],
    };

    productoRepository.findById.mockResolvedValue(Result.success(mockProducto));
    ventaOrmRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockVentaCompleta as any);
    mockQueryRunner.manager.save.mockResolvedValue(mockVentaGuardada);
    productoRepository.update.mockResolvedValue(Result.success(mockProducto));

    // ============================================================
    // ACT
    // ============================================================
    const result = await useCase.execute(dto);
    console.log('🔍 TEST 6 RESULT:', result)

    // ============================================================
    // ASSERT
    // ============================================================

    if (!result.ok){
      console.log('❌ ERROR TEST 6:', result.message)
      console.log('❌ ERROR DETAIL:', result.error)
    }
    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error('Expected success result');
    }

    expect(result.value.getTotal()).toBe(118.0);
    expect(result.value.getSubtotal()).toBe(100.0);
    expect(result.value.getIgv()).toBe(18.0);
  });
});
