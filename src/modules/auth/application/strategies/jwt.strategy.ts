import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export interface JwtPayload {
  sub: string;
  correo: string;
  rol: string;
}

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET ?? 'dev_secret_change_me',
        });
    }

    async validate(payload: JwtPayload) {
        return { sub: payload.sub, correo: payload.correo, rol: payload.rol };
    }
}