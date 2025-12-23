import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RegisterDto, AccessTokenGuard, RefreshTokenGuard, AuthCredentialsDto, AuthService } from './';
import { User } from './decorators/user.decorator.js';
import { OutputUserDto } from '../users/dto/output/output-user.dto.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuthHeader } from '../swagger/decorators/auth-header.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: describe status codes
  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Provide auth credentials and get access and refresh tokens'
  })
  @Post('login')
  async login(@Body() loginDto: AuthCredentialsDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Register a new account'
  })
  @ApiTags('Auth')
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'Provide refresh token in Authorization header and get new access and refresh tokens'
  })
  @ApiAuthHeader(true)
  @ApiTags('Auth')
  @UseGuards(RefreshTokenGuard)
  @Post ('refresh')
  async refresh(@User('email') email: string, @User('refreshToken') refreshToken: string) {
    return await this.authService.refreshTokens(email, refreshToken);
  }

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Delete refresh token from user associated with access token'
  })
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Post('logout') 
  async logout(@User('email') userEmail: string) {
    return await this.authService.logout(userEmail);
  }

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Get user object associated with access token in a header'
  })
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Post('me') 
  async me(@User('email') email: string) {
    return new OutputUserDto(await this.authService.me(email));
  }
}
