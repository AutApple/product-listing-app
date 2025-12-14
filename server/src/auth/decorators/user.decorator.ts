import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type.js';



export const User = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
        const user = context.switchToHttp().getRequest<{ user?: JwtPayload }>().user;
        if (!user)
            return undefined;
        return data ? user[data]: user;
    }
);