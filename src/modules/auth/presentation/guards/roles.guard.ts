import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor( private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // si no hay roles requeridos, permitir acceso
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.rol); // aquí compara el rol del payload con los roles requeridos
        
    }
}