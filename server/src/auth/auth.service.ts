import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import bcrypt from 'bcrypt';
import { globalAuthConfiguration } from '../config/auth.config.js';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
@Injectable()
export class AuthService {
    constructor (
      private readonly userService: UsersService
    ) {}
    async login(loginDto: LoginDto) {
      const {email, password} = loginDto;
      try { 
        const user = await this.userService.findOneByEmail(email, true);
        if (!await bcrypt.compare(password, user.hashedPassword))
          throw new UnauthorizedException(ERROR_MESSAGES.AUTH_WRONG_PASSWORD);
        return user;
      } catch (e: unknown) {
        if (e instanceof Error) 
           throw new UnauthorizedException(e.message);
        throw new UnauthorizedException(ERROR_MESSAGES.UNEXPECTED('login'));
      }
    }

    async register(registerDto: RegisterDto) {
      if(registerDto.password !== registerDto.coniformPassword)
        throw new BadRequestException(ERROR_MESSAGES.AUTH_PASSWORDS_DONT_MATCH());

      const hashedPassword = await bcrypt.hash(registerDto.password, globalAuthConfiguration.saltLevel);
      const {email, name} = registerDto;
      const user = await this.userService.create({email, name, hashedPassword});
      return user;
    }
}
