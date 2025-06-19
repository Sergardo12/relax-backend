import { Rol } from '../../../rol/domain/entities/rol.entity';

export class Usuario {
  constructor(
    public readonly id: number | null,
    public correo?: string,
    public clave?: string,

    public rol?: Rol,
  ) {}
}
