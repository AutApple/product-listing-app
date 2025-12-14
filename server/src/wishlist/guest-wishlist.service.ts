import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { Repository } from 'typeorm';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { CommonWishlistService } from './common-wishlist.service.js';
import { v7 as uuidv7 } from 'uuid';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

@Injectable()
export class GuestWishlistService {
  constructor(
        @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>,
        private readonly commonWishlistService: CommonWishlistService
    ){}
  private checkSession(s: Record<string, any> | undefined): void {
    if(!s) {
      console.error('null session...');
      
    }
  }
  private async createWishlist(session: Record<string, any>): Promise<WishlistEntity> {
      const anonymousId = uuidv7();
      session.anonymousId = anonymousId;
      const wishlist = this.wishlistRepository.create({anonymousId});
      return await this.wishlistRepository.save(wishlist);
  }
  async getOrCreateWishlist(session: Record<string, any> | undefined): Promise<WishlistEntity> {
    if (!session)
      throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('session undefined'));
    let anonymousId: string | undefined = session.anonymousId;
    if (!anonymousId)
        return await this.createWishlist(session);
    
    let wishlist: WishlistEntity | null = await this.wishlistRepository.findOne({where: {anonymousId}, relations: ['items', 'items.product']});
    if (wishlist)
      return wishlist; 
    return await this.createWishlist(session);
  }

  async add(addToWishlistDto: ModifyWishlistDto, session: Record<string, any> | undefined): Promise<WishlistEntity> {
    const wishlist = await this.getOrCreateWishlist(session);
    await this.commonWishlistService.add(addToWishlistDto, wishlist);
    return wishlist;
  }
}
