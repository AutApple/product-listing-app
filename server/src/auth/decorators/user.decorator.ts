import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';
import { JwtPayload } from '../types/jwt-payload.type.js';



export const User = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
        const user = context.switchToHttp().getRequest<{ user?: JwtPayload }>().user;
        if (!user)
            throw new UnauthorizedException(ERROR_MESSAGES.AUTH_NO_USER());
        return data ? user[data]: user;
    }
);