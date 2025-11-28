import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { CommonModule } from '../common/common.module.js';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypeEntity } from '../product-types/entities/product-type.entity.js';
import { ProductTypesModule } from '../product-types/product-types.module.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.js';

@Module({
  imports: [
            TypeOrmModule.forFeature([
              ProductEntity, 
              ProductImageEntity, 
              ProductTypeEntity,
              ProductAttributeValueEntity
            ]), 
            CommonModule,
            ProductTypesModule
          ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
