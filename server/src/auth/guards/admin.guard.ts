import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';
import { UsersService } from '../../users/users.service.js';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload = context.switchToHttp().getRequest<{ user?: JwtPayload }>().user;

    if (!payload)
      throw new ForbiddenException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
    

    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user.isAdmin)
      throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN);
    

    return true;
  }
}