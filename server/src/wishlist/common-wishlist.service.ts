import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModifyWishlistDto, WishlistItemEntity, WishlistEntity } from './';
import { ProductsService } from '../products/products.service.js';
import { ProductEntity } from '../products/entities/product.entity.js';

@Injectable()
export class CommonWishlistService {
  constructor(
    @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(WishlistItemEntity) private readonly wishlistItemRepository: Repository<WishlistItemEntity>,
    private readonly productsService: ProductsService
  ) { }


  // Try to find existing wishlist item for the given product slug. If no exists - create one. If it exists - sum the amount & save  
  async mergeOrCreateItem(productSlug: string, amount: number, wishlist: WishlistEntity): Promise<void> {
    const wishlistItem = wishlist.items.find(w => w.product.slug === productSlug);
    if (!wishlistItem) {
      if (amount <= 0) return;

      const product: ProductEntity = await this.productsService.findEntityBySlug(productSlug);
      wishlist.items.push(this.wishlistItemRepository.create({ product, amount, wishlist }));
      await this.wishlistRepository.save(wishlist);
      return;
    }

    const newAmount = +wishlistItem.amount + amount;
    if (newAmount <= 0)
      wishlist.items = wishlist.items.filter(i => i != wishlistItem);
    else
      wishlistItem.amount = newAmount;
  }

  async add(addToWishlistDto: ModifyWishlistDto, wishlist: WishlistEntity): Promise<WishlistEntity> {
    for (const item of addToWishlistDto.products) {
      await this.mergeOrCreateItem(item.slug, item.amount, wishlist);
    }
    await this.wishlistRepository.save(wishlist);
    return wishlist;
  }
}
