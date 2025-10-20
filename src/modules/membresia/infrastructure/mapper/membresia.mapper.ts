import { Membresia } from "../../domain/entities/membresia.entity";
import { MembresiaOrmEntity } from "../database/membresia.orm-entity";

export class MembresiaMapper {
    static toDomain(membresia: MembresiaOrmEntity): Membresia{
        return new Membresia({
            id: membresia.id,
            nombre: membresia.nombre,
            descripcion: membresia.descripcion,
            precio: membresia.precio,
            duracionDias: membresia.duracionDias,
            estado: membresia.estado
        })
    }

    static toOrmEntity(membresia: Membresia): MembresiaOrmEntity{
        const membresiaOrm = new MembresiaOrmEntity();
        membresiaOrm.id = membresia.getId();
        membresiaOrm.nombre = membresia.getNombre();
        membresiaOrm.descripcion = membresia.getDescripcion();
        membresiaOrm.precio = membresia.getPrecio();
        membresiaOrm.duracionDias = membresia.getDuracionDias();
        membresiaOrm.estado = membresia.getEstado();
        return membresiaOrm
    }
}