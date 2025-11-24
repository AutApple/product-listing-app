import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { CommonModule } from '../common/common.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CommonModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
