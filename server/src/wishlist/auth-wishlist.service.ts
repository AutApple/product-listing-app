import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { WishlistItemEntity } from './entities/wishlist-item.entity.js';
import { CommonWishlistService } from './common-wishlist.service.js';

@Injectable()
export class AuthWishlistService {
  constructor(
    @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(WishlistItemEntity) private readonly wishlistItemRepository: Repository<WishlistItemEntity>,
    private readonly usersService: UsersService,
    private readonly commonWishlistService: CommonWishlistService
  ) {}

  async getOrCreateWishlist(email: string): Promise<WishlistEntity> {
      let wishlist: WishlistEntity | null = await this.wishlistRepository.findOne({where: {user: {email}}, relations: ['items', 'items.product']});
      if (wishlist)
        return wishlist; 
      const user = await this.usersService.findOneByEmail(email);
      wishlist = this.wishlistRepository.create({user});
      return await this.wishlistRepository.save(wishlist);
  }

  async add(addToWishlistDto: ModifyWishlistDto, email: string): Promise<WishlistEntity> {
    const wishlist = await this.getOrCreateWishlist(email);
    await this.commonWishlistService.add(addToWishlistDto, wishlist);
    return wishlist;
  }
}
