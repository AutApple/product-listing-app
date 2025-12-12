import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';

interface UserReqType {
    userId: string,
    email: string,
    refreshToken?: string;
}


export const User = createParamDecorator(
    (data: keyof UserReqType | undefined, context: ExecutionContext) => {
        const user = context.switchToHttp().getRequest<{ user?: UserReqType }>().user;
        if (!user)
            throw new UnauthorizedException(ERROR_MESSAGES.AUTH_NO_USER());
        return data ? user[data]: user;
    }
);