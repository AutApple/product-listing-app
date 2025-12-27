import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { RegisterDto, AccessTokenGuard, RefreshTokenGuard, AuthCredentialsDto, OutputAuthDto, ChangePasswordDto, ChangeEmailDto } from './';
import { User } from './decorators/user.decorator.js';
import { OutputUserDto } from '../users/dto/output/output-user.dto.js';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuthHeader } from '../swagger/decorators/auth-header.decorator.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // TODO: describe status codes
  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Provide auth credentials and get access and refresh tokens'
  })
  @ApiOkResponse({type: OutputAuthDto, description: 'Access and refresh tokens'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: AuthCredentialsDto) {
    return await this.authService.login(loginDto);
  }
  
  @ApiCreatedResponse({type: OutputAuthDto, description: 'Access and refresh tokens'})
  @ApiBadRequestResponse({ description: 'Bad Request: required fields missing' })
  @ApiConflictResponse({ description: 'Conflict: User with specified email already exists '})
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
  @ApiOkResponse({type: OutputAuthDto, description: 'Access and refresh tokens'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: no valid refresh token provided' })
  @UseGuards(RefreshTokenGuard)
  @Post ('refresh')
  async refresh(@User('email') email: string, @User('refreshToken') refreshToken: string) {
    return await this.authService.refreshTokens(email, refreshToken);
  }

  
  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Delete refresh token from user associated with access token'
  })
  @ApiOkResponse({type: Boolean, example: true, description: 'Always returns true on successfull logout'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Post('logout') 
  async logout(@User('email') userEmail: string) {
    return await this.authService.logout(userEmail);
  }

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Change password'
  })
  @ApiOkResponse({type: Boolean, example: true, description: 'Always returns true on successfull password change'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
  @ApiBadRequestResponse({ description: 'Password and confirm password don\'t match' })
  @ApiAuthHeader()
  @Post('change-password')
  async changePassword(@User ('email') userEmail: string, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(userEmail, changePasswordDto);
  }

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Change email'
  })
  @ApiOkResponse({type: Boolean, example: true, description: 'Always returns true on successfull password change'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
  @ApiAuthHeader()
  @Post('change-email')
  async changeEmail(@User ('email') userEmail: string, @Body() changeEmailDto: ChangeEmailDto) {
    return await this.authService.changeEmail(userEmail, changeEmailDto);
  }

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'Get user object associated with access token in a header'
  })
  @ApiOkResponse({type: OutputUserDto, description: 'User object associated with provided credentials'})
  @ApiUnauthorizedResponse({ description: 'Unauthorized: invalid auth credentials' })
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Post('me') 
  async me(@User('email') email: string) {
    return new OutputUserDto(await this.authService.me(email));
  }
}
