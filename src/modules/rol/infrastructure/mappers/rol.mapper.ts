import { Rol } from '../../domain/entities/rol.entity';
import { RolOrmEntity } from '../database/rol.orm-entity';

export class RolMapper {
  static toDomain(orm: RolOrmEntity): Rol {
    return new Rol(orm.id, orm.nombreRol);
  }
//   ¿Qué hace?
// Convierte una entidad que viene de la base de datos (entidad ORM) a una entidad de dominio.
// Es decir, transforma el modelo que entiende TypeORM a un modelo que entiende tu aplicación.

// ¿Cuándo se usa?
// Después de obtener datos de la base de datos con TypeORM (por ejemplo, al hacer un findOne), 
// para usarlos en tu lógica de negocio.



  static toOrmEntity(domain: Rol): RolOrmEntity {
    const orm = new RolOrmEntity();
    orm.id = domain.id || 0;
    orm.nombreRol = domain.nombreRol;
    orm.usuarios = [] // ✅ Para evitar error si la propiedad es obligatoria
    return orm;
  }

//   ¿Qué hace?
// Convierte una entidad de dominio (Rol) en una entidad ORM (RolOrmEntity) 
// que TypeORM necesita para guardar en la base de datos.

// ¿Cuándo se usa?
// Antes de guardar un nuevo Rol con TypeORM, por ejemplo, al hacer repo.save(...).

// 🧠 Nota: El domain.id || 0 es útil si estás creando un nuevo rol (donde id es null). 
// Aunque no siempre es necesario, si tu base de datos autogenera el ID,
//  podrías simplemente omitir esa línea.
}
