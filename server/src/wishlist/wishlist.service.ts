import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { ProductsService } from '../products/products.service.js';
import { ProductEntity } from '../products/entities/product.entity.js';
import { WishlistItemEntity } from './entities/wishlist-item.entity.js';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(WishlistItemEntity) private readonly wishlistItemRepository: Repository<WishlistItemEntity>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService
  ) {}

  async getOrCreateWishlist(email: string): Promise<WishlistEntity> {
      let wishlist: WishlistEntity | null = await this.wishlistRepository.findOne({where: {user: {email}}, relations: ['items', 'items.product']});
      if (wishlist)
        return wishlist; 
      const user = await this.usersService.findOneByEmail(email);
      wishlist = this.wishlistRepository.create({user});
      return await this.wishlistRepository.save(wishlist);
  }

  // Try to find existing wishlist item for the given product slug. If no exists - create one. If it exists - sum the amount & save  
  async mergeOrCreateItem(productSlug: string, amount: number, wishlist: WishlistEntity): Promise<void> {
      const wishlistItem = wishlist.items.find(w => w.product.slug === productSlug);
      if (!wishlistItem) {
        if (amount <= 0) return;
       
        const product: ProductEntity = await this.productsService.findOneBySlug(productSlug);
        wishlist.items.push(this.wishlistItemRepository.create({product, amount, wishlist}));
        await this.wishlistRepository.save(wishlist);
        return;
      }

      const newAmount = +wishlistItem.amount + amount; 
      if (newAmount <= 0)
        wishlist.items = wishlist.items.filter(i => i != wishlistItem);
      else
        wishlistItem.amount = newAmount;
    }

    async add(addToWishlistDto: ModifyWishlistDto, email: string): Promise<WishlistEntity> {
      const wishlist = await this.getOrCreateWishlist(email);
      for (const item of addToWishlistDto.products) {
          await this.mergeOrCreateItem(item.slug, item.amount, wishlist);
      }
      await this.wishlistRepository.save(wishlist);
      return wishlist;
    }
}
