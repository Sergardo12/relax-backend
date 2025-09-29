import * as bcrypt from 'bcrypt';
export class ContraseñaService{
    async hashearContraseña(contraseña: string): Promise<string>{
        return await bcrypt.hash(contraseña, 10);
    }

    async compararContraseñas(contraseña: string, hash: string): Promise<boolean>{
        return await bcrypt.compare(contraseña, hash);
    }
}