import { UsuarioOrmEntity } from 'src/modules/usuario/infrastructure/database/usuario-entity.orm';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteOrmEntity } from "../database/paciente.orm-entity";
import { UsuarioMapper } from 'src/modules/usuario/infrastructure/mapper/usuario.mapper';


export class PacienteMapper {
    static toDomain(paciente: PacienteOrmEntity): Paciente {
        return new Paciente({
            id: paciente.id,
            usuario: UsuarioMapper.toDomain(paciente.usuario), // Relación con Usuario
            nombres: paciente.nombres,
            apellidos: paciente.apellidos,
            dni: paciente.dni,
            fechaNacimiento: paciente.fechaNacimiento,
            telefono: paciente.telefono

        }
            
        );
    }
    
    
    static toOrmEntity(paciente: Paciente): PacienteOrmEntity {
        const pacienteOrm = new PacienteOrmEntity();
        pacienteOrm.id = paciente.getId();

        // Relación con Usuario
        // Creamos una instancia de UsuarioOrmEntity 
        const usuarioOrm = new UsuarioOrmEntity();
        // Solo asignamos el ID del usuario relacionado
        usuarioOrm.id = paciente.getUsuario().getId();
        // Asignamos el usuarioOrm al pacienteOrm
        pacienteOrm.usuario = usuarioOrm;

        pacienteOrm.nombres = paciente.getNombres();
        pacienteOrm.apellidos = paciente.getApellidos();
        pacienteOrm.dni = paciente.getDni() ;
        pacienteOrm.fechaNacimiento = paciente.getFechaNacimiento() ;
        pacienteOrm.telefono = paciente.getTelefono();

        return pacienteOrm;
    }

}