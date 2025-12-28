import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../config/';
import { UserEntity } from '../users/';
import { OutputAuthDto, RegisterDto, AuthCredentialsDto, ChangePasswordDto, ChangeEmailDto } from './';
import { JwtService } from '@nestjs/jwt';
import { globalAuthConfiguration } from '../config/auth.config.js';
import { UsersService } from '../users/users.service.js';
@Injectable()
export class AuthService {
    constructor (
      private readonly usersService: UsersService,
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
        user = await this.usersService.findOneByEmail(email, true);
      } catch (e: unknown) {
        if (e instanceof NotFoundException) 
           throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS());
        console.log('Unexpected error during user validation: ', e);
        throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('user validation'));
      }
      
      if (!await user.matchesPassword(password))
        throw new UnauthorizedException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS());
      
      return user;
    }

    async makeAndUpdateRefreshToken(userId: string, email: string) {
      const tokens = await this.getTokens(userId, email);
      await this.usersService.setRefreshToken(email, tokens.refreshToken);
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
      const user = await this.usersService.create({email, name, password});
      return await this.makeAndUpdateRefreshToken(user.id, user.email);
    }
    
    async logout(email: string): Promise<boolean> {
      await this.usersService.setRefreshToken(email, null);
      return true;
    }
    
    async refreshTokens(email: string, refreshToken: string): Promise<OutputAuthDto> {
      const user = await this.usersService.findOneByEmail(email);
      if (!await user.hasValidRefreshToken(refreshToken)) 
        throw new ForbiddenException(ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS());
      const tokens = await this.getTokens(user.id, user.email);
      await this.usersService.setRefreshToken(email, tokens.refreshToken);
      return tokens;
    }

    async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
      await this.validateUser({ email, password: changePasswordDto.password });
      if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword)
        throw new BadRequestException(ERROR_MESSAGES.AUTH_PASSWORDS_DONT_MATCH());
      this.usersService.changeCredentials(email, { password: changePasswordDto.newPassword });
    }

    async changeEmail(email: string, changeEmailDto: ChangeEmailDto) {
      await this.validateUser({ email, password: changeEmailDto.password });
      this.usersService.changeCredentials(email, { email: changeEmailDto.newEmail });
    }
  }
