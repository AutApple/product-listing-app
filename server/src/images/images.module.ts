import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity.js';
import { UsersModule } from '../users/users.module.js';
import { ImagesS3Service } from './images-s3.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImageEntity
    ]),
    UsersModule
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesS3Service],
})
export class ImagesModule {}
