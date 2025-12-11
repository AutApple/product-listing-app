import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { globalAuthConfiguration } from '../../config/auth.config.js';
import { Request } from 'express';
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: globalAuthConfiguration.jwtRefreshSecret,
            passReqToCallback: true
        });
    }
    validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization')?.replace('Bearer', '').trim(); //extract refresh token from request
        return {
            ...payload,
            refreshToken
        };
    }
   
}