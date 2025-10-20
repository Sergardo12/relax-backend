// Importamos las utilidades necesarias de NestJS
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// Importamos la interfaz de nuestro payload del JWT (la info que viene dentro del token)
import { JwtPayload } from "../../application/strategies/jwt.strategy";

// Creamos un decorador personalizado llamado @UsuarioActual
// Este decorador nos permite acceder fácilmente al usuario autenticado desde los controladores
export const UsuarioActual = createParamDecorator(
  (
    // "data" es opcional: si lo pasamos, será una propiedad específica del JwtPayload
    // Ejemplo: @UsuarioActual('correo') → devolverá solo el correo
    // Si no pasamos nada, devolverá todo el payload
    data: keyof JwtPayload | undefined,

    // "ctx" representa el contexto actual de la petición (HTTP, GraphQL, etc.)
    ctx: ExecutionContext,
  ) => {
    // Obtenemos el request (la petición HTTP actual)
    const request = ctx.switchToHttp().getRequest();

    // De aquí sacamos el usuario que guardamos en el proceso de validación del JWT (Passport)
    const user = request.user as JwtPayload;

    // Si no se pasa ningún argumento → devolvemos todo el usuario (todo el payload del JWT)
    if (!data) {
      return user;
    }

    // Si se pasa un argumento (ej: 'correo', 'sub', etc.) → devolvemos solo esa propiedad
    return user?.[data];
  },



);


// @UsuarioActual

// Qué es: un decorador que te evita repetir req.user.sub en todos lados.

// Dónde está la lógica: en el decorador que extrae datos del request.

// Uso: en el controller, simplemente pones @UsuarioActual('sub') id: string.