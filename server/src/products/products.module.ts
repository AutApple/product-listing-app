import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { CommonModule } from '../common/common.module.js';
import { ProductImageEntity } from './entities/product-image.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]), CommonModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
