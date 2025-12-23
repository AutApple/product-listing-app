import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AccessTokenStrategy, RefreshTokenStrategy,  AuthService } from './';
import { AuthController } from './auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
