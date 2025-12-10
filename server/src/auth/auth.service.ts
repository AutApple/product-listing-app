import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import bcrypt from 'bcrypt';
import { globalAuthConfiguration } from '../config/auth.config.js';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { OutputUserDto } from '../users/dto/output/output-user.dto.js';
import { UserEntity } from '../users/entities/user.entity.js';
@Injectable()
export class AuthService {
    constructor (
      private readonly userService: UsersService
    ) {}

    async login(loginDto: LoginDto): Promise<OutputUserDto> {
      const {email, password} = loginDto;
      let user: UserEntity;
      try { 
        user = await this.userService.findOneByEmail(email, true);
      } catch (e: unknown) {
        if (e instanceof NotFoundException) 
           throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
        console.log('Unexpected error during login: ', e);
        throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('login'));
      }
      
      if (!await user.matchesPassword(password))
        throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
      
      return new OutputUserDto(user);
    }

    async register(registerDto: RegisterDto): Promise<OutputUserDto> {
      if(registerDto.password !== registerDto.confirmPassword)
        throw new BadRequestException(ERROR_MESSAGES.AUTH_PASSWORDS_DONT_MATCH());

      
      const {email, name, password} = registerDto;
      const user: OutputUserDto = await this.userService.create({email, name, password});
      return user;
    }
}
