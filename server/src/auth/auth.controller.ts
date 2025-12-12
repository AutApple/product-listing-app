import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { User } from './decorators/user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: AuthCredentialsDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post ('refresh')
  async refresh(@User('email') email: string, @User('refreshToken') refreshToken: string) {
    return await this.authService.refreshTokens(email, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout') 
  async logout(@User('email') userEmail: string) {
    return await this.authService.logout(userEmail);
  }

  @Post('me') 
  async me() {
    return 'me route';
  }
}
