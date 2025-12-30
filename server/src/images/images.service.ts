import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity.js';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { ImagesS3Service } from './images-s3.service.js';
import { S3Object } from 'aws-sdk/clients/rekognition.js';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesS3Service: ImagesS3Service,
    private readonly usersService: UsersService,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>
  ) { }

  async upload(uploadImageDto: UploadImageDto, file: Express.Multer.File, uploaderEmail: string): Promise<ImageEntity> {
      const { slug } = uploadImageDto;
      const filename = await this.imagesS3Service.upload(file);
      const user = await this.usersService.findOneByEmail(uploaderEmail);
      
      const imageEntity =  this.imageRepository.create({slug, filename, author: user});
      await this.imageRepository.save(imageEntity);
      return imageEntity;
  }   
}
