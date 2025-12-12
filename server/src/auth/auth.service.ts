import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { OutputUserDto } from '../users/dto/output/output-user.dto.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { OutputAuthDto } from './dto/output/output-auth.dto.js';
import { JwtService } from '@nestjs/jwt';
import { globalAuthConfiguration } from '../config/auth.config.js';
@Injectable()
export class AuthService {
    constructor (
      private readonly userService: UsersService,
      private readonly jwtService: JwtService
    ) {}

    async getTokens(userId: string, email: string): Promise<OutputAuthDto> {
      const accessToken = await this.jwtService.signAsync({userId, email}, {
        expiresIn: globalAuthConfiguration.jwtAccessTokenExpiration,
        secret: globalAuthConfiguration.jwtAccessSecret
      });
      const refreshToken = await this.jwtService.signAsync({userId, email}, {
        expiresIn: globalAuthConfiguration.jwtRefreshTokenExpiration,
        secret: globalAuthConfiguration.jwtRefreshSecret
      }) 
      return {accessToken, refreshToken};
    }
    
    async validateUser(authDto: AuthCredentialsDto): Promise<UserEntity> {
      const {email, password} = authDto;
      let user: UserEntity;
      try { 
        user = await this.userService.findOneByEmail(email, true);
      } catch (e: unknown) {
        if (e instanceof NotFoundException) 
           throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS());
        console.log('Unexpected error during user validation: ', e);
        throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('user validation'));
      }
      
      if (!await user.matchesPassword(password))
        throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
      
      return user;
    }

    async makeAndUpdateRefreshToken(userId: string, email: string) {
      const tokens = await this.getTokens(userId, email);
      await this.userService.setRefreshToken(email, tokens.refreshToken);
      return tokens;
    }

    async login (loginDto: AuthCredentialsDto): Promise<OutputAuthDto> {
      const user = await this.validateUser(loginDto);
      return await this.makeAndUpdateRefreshToken(user.id, user.email);
    }
    async register(registerDto: RegisterDto): Promise<OutputAuthDto> {
      if(registerDto.password !== registerDto.confirmPassword)
        throw new BadRequestException(ERROR_MESSAGES.AUTH_PASSWORDS_DONT_MATCH());
      const {email, name, password} = registerDto;
      const user = await this.userService.create({email, name, password});
      return await this.makeAndUpdateRefreshToken(user.id, user.email);
    }
    
    async logout(email: string): Promise<boolean> {
      await this.userService.setRefreshToken(email, null);
      return true;
    }
    
    async refreshTokens(email: string, refreshToken: string): Promise<OutputAuthDto> {
      const user = await this.userService.findOneByEmail(email);
      if (!await user.hasValidRefreshToken(refreshToken)) 
        throw new ForbiddenException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS);
      const tokens = await this.getTokens(user.id, user.email);
      await this.userService.setRefreshToken(email, tokens.refreshToken);
      return tokens;
    }
  }
