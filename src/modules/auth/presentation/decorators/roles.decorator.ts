import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// @Roles

// Qué es: un decorador que solo añade metadatos al endpoint (roles: [...]).
// → Es como decir: “este endpoint solo lo pueden acceder roles X, Y, Z”.

// Dónde está la lógica: en el RolesGuard, que lee esos metadatos con Reflector y compara contra el rol del usuario.

// Uso: en el controller pones @Roles('admin'), y el RolesGuard hace el trabajo.