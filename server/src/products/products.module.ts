import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypeEntity } from '../product-types/entities/product-type.entity.js';
import { ProductTypesModule } from '../product-types/product-types.module.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.entity.js';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';
import { CategoryEntity } from '../categories/entities/category.entity.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { ProductsFilterService } from './products-filter.service.js';

@Module({
  imports: [
            TypeOrmModule.forFeature([
              ProductEntity, 
              ProductImageEntity, 
              ProductTypeEntity,
              ProductAttributeValueEntity,
              AttributeEntity,
              CategoryEntity
            ]), 
            ProductTypesModule,
            CategoriesModule
          ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsFilterService],
})
export class ProductsModule {}
