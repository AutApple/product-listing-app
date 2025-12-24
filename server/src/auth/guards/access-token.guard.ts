import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';

export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if (err || !user) 
            throw new UnauthorizedException(ERROR_MESSAGES.AUTH_REQUIRED());
        return user;
    }
}