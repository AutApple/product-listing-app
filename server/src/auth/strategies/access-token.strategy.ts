import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { globalAuthConfiguration } from '../../config/auth.config.js';
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: globalAuthConfiguration.jwtAccessSecret
        });
    }
    validate(payload: any) {
        return payload;
    }
   
}