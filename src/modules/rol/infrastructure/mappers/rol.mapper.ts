import { Rol } from '../../domain/entities/rol.entity';
import { RolOrmEntity } from '../database/rol.orm-entity';

export class RolMapper {
  static toDomain(orm: RolOrmEntity): Rol {
    return new Rol(orm.id, orm.nombreRol);
  }

  static toOrmEntity(domain: Rol): RolOrmEntity {
    const orm = new RolOrmEntity();
    orm.id = domain.id || 0;
    orm.nombreRol = domain.nombreRol;
    return orm;
  }
}
