import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { ImagesS3Service } from './images-s3.service.js';
import { Response } from 'express';

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

    const imageEntity = this.imageRepository.create({ slug, filename, author: user });
    await this.imageRepository.save(imageEntity);
    return imageEntity;
  }
  async getImage(slug: string, res: Response): Promise<ImageEntity> {
    const image = await this.imageRepository.findOneBy({ slug });
    if (!image)
      throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('image', slug));
    try {
      const s3Object = await this.imagesS3Service.getImage(image.filename);

      res.setHeader('Content-Type', s3Object.ContentType || 'application/octet-stream');
      res.setHeader('Content-Length', s3Object.ContentLength?.toString() || '0');

      (s3Object.Body as any).pipe(res);
    } catch (err) {
      throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('image', slug));
    }
    return image;
  }
}
