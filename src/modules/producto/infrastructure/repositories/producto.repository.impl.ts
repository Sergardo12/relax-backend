import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, LessThan } from 'typeorm';
import { Result } from 'src/common/types/result';
import { Producto } from '../../domain/entities/producto.entity';
import { ProductoRepository } from '../../domain/repositories/producto.repository';
import { ProductoOrmEntity } from '../database/producto.orm-entity';
import { ProductoMapper } from '../mapper/producto.mapper';
import { EstadoProducto } from '../../domain/enums/producto.enum';

@Injectable()
export class ProductoRepositoryImpl implements ProductoRepository {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly productoRepository: Repository<ProductoOrmEntity>,
  ) {}

  async create(producto: Producto): Promise<Result<Producto>> {
    try {
      const productoOrm = ProductoMapper.toOrmEntity(producto);
      const saved = await this.productoRepository.save(productoOrm);

      const reloaded = await this.productoRepository.findOne({
        where: { id: saved.id },
      });

      if (!reloaded) {
        return Result.failure('Error al recargar el producto creado');
      }

      return Result.success(ProductoMapper.toDomain(reloaded));
    } catch (error) {
      console.error('Error en create:', error);
      return Result.failure('Error al crear el producto', error);
    }
  }

  async findAll(): Promise<Result<Producto[]>> {
    try {
      const productos = await this.productoRepository.find({
        order: { createdAt: 'DESC' },
      });

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findAll:', error);
      return Result.failure('Error al buscar todos los productos', error);
    }
  }

  async findById(id: string): Promise<Result<Producto | null>> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id },
      });

      if (!producto) {
        return Result.success(null);
      }

      return Result.success(ProductoMapper.toDomain(producto));
    } catch (error) {
      console.error('Error en findById:', error);
      return Result.failure('Error al buscar el producto', error);
    }
  }

  async findByNombre(nombre: string): Promise<Result<Producto[]>> {
    try {
      const productos = await this.productoRepository.find({
        where: { nombre: Like(`%${nombre}%`) },
        order: { nombre: 'ASC' },
      });

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findByNombre:', error);
      return Result.failure('Error al buscar productos por nombre', error);
    }
  }

  async findByCategoria(categoria: string): Promise<Result<Producto[]>> {
    try {
      const productos = await this.productoRepository.find({
        where: { categoria },
        order: { nombre: 'ASC' },
      });

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findByCategoria:', error);
      return Result.failure('Error al buscar productos por categoría', error);
    }
  }

  async findStockBajo(): Promise<Result<Producto[]>> {
    try {
      const productos = await this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.stock <= producto.stockMinimo')
        .andWhere('producto.estado = :estado', { estado: EstadoProducto.ACTIVO })
        .orderBy('producto.stock', 'ASC')
        .getMany();

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findStockBajo:', error);
      return Result.failure('Error al buscar productos con stock bajo', error);
    }
  }

  async findVencidos(): Promise<Result<Producto[]>> {
    try {
      const hoy = new Date();
      
      const productos = await this.productoRepository.find({
        where: {
          fechaVencimiento: LessThan(hoy),
          estado: EstadoProducto.ACTIVO,
        },
        order: { fechaVencimiento: 'ASC' },
      });

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findVencidos:', error);
      return Result.failure('Error al buscar productos vencidos', error);
    }
  }

  async findActivos(): Promise<Result<Producto[]>> {
    try {
      const productos = await this.productoRepository.find({
        where: { estado: EstadoProducto.ACTIVO },
        order: { nombre: 'ASC' },
      });

      const productosDomain = productos.map(ProductoMapper.toDomain);
      return Result.success(productosDomain);
    } catch (error) {
      console.error('Error en findActivos:', error);
      return Result.failure('Error al buscar productos activos', error);
    }
  }

  async update(id: string, producto: Producto): Promise<Result<Producto>> {
    try {
      const exists = await this.productoRepository.findOne({ where: { id } });
      if (!exists) {
        return Result.failure('Producto no encontrado');
      }

      const productoOrm = ProductoMapper.toOrmEntity(producto);
      await this.productoRepository.save(productoOrm);

      const updated = await this.productoRepository.findOne({
        where: { id },
      });

      if (!updated) {
        return Result.failure('Error al recargar el producto actualizado');
      }

      return Result.success(ProductoMapper.toDomain(updated));
    } catch (error) {
      console.error('Error en update:', error);
      return Result.failure('Error al actualizar el producto', error);
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const producto = await this.productoRepository.findOne({
        where: { id },
      });

      if (!producto) {
        return Result.failure('Producto no encontrado');
      }

      // Borrado lógico: cambiar estado a INACTIVO
      producto.estado = EstadoProducto.INACTIVO;
      await this.productoRepository.save(producto);

      return Result.success(true);
    } catch (error) {
      console.error('Error en delete:', error);
      return Result.failure('Error al eliminar el producto', error);
    }
  }
}