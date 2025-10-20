import { Colaborador } from '../../domain/entities/colaborador.entity';
import { ColaboradorOrmEntity } from "../database/colaborador.orm-entity";
import { EspecialidadOrmEntity } from "src/modules/especialidad/infrastructure/database/especialidad.orm-entity";
import { UsuarioMapper } from 'src/modules/usuario/infrastructure/mapper/usuario.mapper';
import { UsuarioOrmEntity } from 'src/modules/usuario/infrastructure/database/usuario-entity.orm';

export class ColaboradorMapper {
    /**
     * Convierte de ORM entity a Domain entity
     */
    static toDomain(colaboradorOrm: ColaboradorOrmEntity): Colaborador {
        return new Colaborador({
            id: colaboradorOrm.id,
            usuario: UsuarioMapper.toDomain(colaboradorOrm.usuario),
            especialidad: colaboradorOrm.especialidad,
            nombres: colaboradorOrm.nombres,
            apellidos: colaboradorOrm.apellidos,
            dni: colaboradorOrm.dni,
            fechaNacimiento: colaboradorOrm.fechaNacimiento,
            fechaContratacion: colaboradorOrm.fechaContratacion,
            telefono: colaboradorOrm.telefono,
        });
    }

    /**
     * Convierte de Domain entity a ORM entity
     */
    static toOrmEntity(colaborador: Colaborador): ColaboradorOrmEntity {
        const colaboradorOrm = new ColaboradorOrmEntity();
        colaboradorOrm.id = colaborador.getId();

        // Crear UsuarioOrmEntity solo con ID
        const usuarioOrm = new UsuarioOrmEntity();
        usuarioOrm.id = colaborador.getUsuario().getId();
        colaboradorOrm.usuario = usuarioOrm;

        // Crear EspecialidadOrmEntity solo con ID
        const especialidadOrm = new EspecialidadOrmEntity();
        especialidadOrm.id = colaborador.getEspecialidad().id;
        colaboradorOrm.especialidad = especialidadOrm;

        colaboradorOrm.nombres = colaborador.getNombres();
        colaboradorOrm.apellidos = colaborador.getApellidos();
        colaboradorOrm.dni = colaborador.getDni();
        colaboradorOrm.fechaNacimiento = colaborador.getFechaNacimiento();
        colaboradorOrm.fechaContratacion = colaborador.getFechaContratacion();
        colaboradorOrm.telefono = colaborador.getTelefono();

        return colaboradorOrm;
    }
}