import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { WishlistItemEntity } from './entities/wishlist-item.entity.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WishlistEntity,
      WishlistItemEntity
    ]),
    ProductsModule
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
