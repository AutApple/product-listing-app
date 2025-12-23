import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { CategoryEntity } from '../categories/entities/category.entity.js';
import { ProductTypeEntity } from '../product-types/entities/product-type.entity.js';
import { ProductTypesModule } from '../product-types/product-types.module.js';
import { WishlistEntity } from '../wishlist/entities/wishlist.entity.js';
import { ProductAttributeValueEntity } from './entities/product-attribute-value.entity.js';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductEntity } from './entities/product.entity.js';
import { ProductsFilterService } from './products-filter.service.js';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductView } from './views/product.view.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductTypeEntity,
      ProductAttributeValueEntity,
      AttributeEntity,
      CategoryEntity,
      WishlistEntity,

      ProductView
    ]),
    ProductTypesModule,
    CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsFilterService],
  exports: [ProductsService]
})
export class ProductsModule { }
