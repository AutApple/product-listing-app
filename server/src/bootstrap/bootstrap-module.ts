import { Module } from '@nestjs/common';
import { RootUserService } from './root-user.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/index.js';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity
        ]), 
        ConfigModule
    ],
    providers: [RootUserService]
}
)
export class BootstrapModule { }