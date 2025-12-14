import { Module } from '@nestjs/common';
import { AuthWishlistService } from './auth-wishlist.service';
import { AuthWishlistController } from './auth-wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { WishlistItemEntity } from './entities/wishlist-item.entity.js';
import { ProductsModule } from '../products/products.module.js';
import { GuestWishlistService } from './guest-wishlist.service.js';
import { GuestWishlistController } from './guest-wishlist.controller.js';
import { CommonWishlistService } from './common-wishlist.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WishlistEntity,
      WishlistItemEntity
    ]),
    ProductsModule
  ],
  controllers: [AuthWishlistController, GuestWishlistController],
  providers: [AuthWishlistService, GuestWishlistService, CommonWishlistService],
})
export class WishlistModule { }
