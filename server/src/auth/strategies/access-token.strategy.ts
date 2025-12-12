import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { globalAuthConfiguration } from '../../config/auth.config.js';
import { JwtPayload } from '../types/jwt-payload.type.js';
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: globalAuthConfiguration.jwtAccessSecret
        });
    }
    validate(payload: JwtPayload) {
        return payload;
    }
   
}