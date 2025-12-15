import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    super.canActivate(context);
    return true;
  }

  // ensure no error is thrown and user is either the payload or undefined
  handleRequest(err: any, user: any): any {
    if (err || !user) 
      return undefined; 
    
    return user; 
  }
}