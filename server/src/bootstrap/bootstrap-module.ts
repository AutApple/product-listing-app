import { Module } from '@nestjs/common';
import { RootUserService } from './root-user.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/index.js';

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity
    ])],
    providers: [RootUserService]
}
)
export class BootstrapModule { }