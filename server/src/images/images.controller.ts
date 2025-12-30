import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, User } from '../auth/index.js';
import { ApiAuthHeader } from '../swagger/index.js';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SwaggerImageDto } from './dto/swagger-image.dto.js';
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  
  @ApiTags('Images')
  @ApiOperation({summary: 'Upload image to the cloud storage'})
  @ApiAuthHeader()
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: SwaggerImageDto, description: 'Upload image data'})
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async upload(@Body('data') data: string, @UploadedFile() file: Express.Multer.File, @User('email') uploaderEmail: string) {
     const parsedData = JSON.parse(data);

    // transform into DTO and validate
    const uploadImageDto = plainToInstance(UploadImageDto, parsedData);
    await validateOrReject(uploadImageDto);
    
    return this.imagesService.upload(uploadImageDto, file, uploaderEmail);
  }

  @ApiTags('Images')
  @ApiOperation({summary: 'Get specific image from the cloud storage'})
  @ApiParam({name: 'slug', description: 'Slug of an image'})
  @Get(':slug')
  async getImage(@Param('slug') slug: string, @Res() res: Response) {
    return await this.imagesService.getImage(slug, res);
  }
}
