import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity
  ])],
  providers: [UsersService],
  exports: [UsersService]

})
export class UsersModule {}
