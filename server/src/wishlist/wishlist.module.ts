import { Module } from '@nestjs/common';
import { AuthWishlistService } from './auth-wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { WishlistItemEntity } from './entities/wishlist-item.entity.js';
import { ProductsModule } from '../products/products.module.js';
import { GuestWishlistService } from './guest-wishlist.service.js';
import { CommonWishlistService } from './common-wishlist.service.js';
import { WishlistOrchestratorService } from './wishlist-orchestrator.service.js';
import { WishlistController } from './wishlist.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WishlistEntity,
      WishlistItemEntity
    ]),
    ProductsModule
  ],
  controllers: [WishlistController],
  providers: [
    AuthWishlistService, 
    GuestWishlistService, 
    CommonWishlistService,
    WishlistOrchestratorService
  ],
})
export class WishlistModule { }
