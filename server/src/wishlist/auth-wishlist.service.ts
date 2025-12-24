import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity, ModifyWishlistDto, WishlistItemEntity } from './';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { CommonWishlistService } from './common-wishlist.service.js';
import { addDays } from 'date-fns';

@Injectable()
export class AuthWishlistService {
  constructor(
    @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(WishlistItemEntity) private readonly wishlistItemRepository: Repository<WishlistItemEntity>,
    private readonly usersService: UsersService,
    private readonly commonWishlistService: CommonWishlistService
  ) { }

  private mergeWishlistItems(... wishlists: WishlistEntity[]): WishlistItemEntity[] {
      const wishlistCopies: WishlistEntity[] = [];
      for (const w of wishlists)
        wishlistCopies.push({... w});
      
      const resultingWishlistItems: WishlistItemEntity[] = [];
      for (const wishlist of wishlistCopies) {
        for (const item of wishlist.items) {
            const findItemIdx = resultingWishlistItems.findIndex(i => i.product.slug === item.product.slug);
            if (findItemIdx !== -1) {
              resultingWishlistItems[findItemIdx].amount = +resultingWishlistItems[findItemIdx].amount + +item.amount;
              continue;
            }
            resultingWishlistItems.push({... item});
         }
      }
      return resultingWishlistItems;
  } 

  async getOrCreateWishlist(email: string, session: Record<string, any>): Promise<WishlistEntity> {
    // possible scenarios: 
    // 1.) there is session based wishlist but no user wishlist yet. resolve: just assign user to that wishlist 
    // 2.) there is session based wishlist AND user wishlist. resolve: merge them together into single wishlist
    // 3.) there is no session based wishlist and user based wishlist. return it 
    // 4.) there is no user based wishlist and no session based wishlist. create user based wishlist.
    
    let userWishlist: WishlistEntity | null = await this.wishlistRepository.findOne({ where: { user: { email } }, relations: ['items', 'items.product'] });
    let sessionWishlist: WishlistEntity | null = null; 
    
    const anonymousId: string | null | undefined = session.anonymousId;
    if(anonymousId)
      sessionWishlist = await this.wishlistRepository.findOne({where: {anonymousId}, relations: ['items', 'items.product']});
    
    if(!sessionWishlist && userWishlist)
        return userWishlist; 

    if (sessionWishlist && userWishlist) {
        const mergedItems = this.mergeWishlistItems(sessionWishlist, userWishlist);

        userWishlist.items = []; 
        for (const itemData of mergedItems) {
          const newItem = this.wishlistItemRepository.create({
            ...itemData,
            wishlist: userWishlist,
          });
          userWishlist.items.push(newItem);
        }

        await this.wishlistItemRepository.remove(sessionWishlist.items);
        await this.wishlistRepository.remove(sessionWishlist);

        session.anonymousId = null;
        return await this.wishlistRepository.save(userWishlist);
    }
        
    const user = await this.usersService.findOneByEmail(email);

    if (sessionWishlist && !userWishlist) {
        sessionWishlist.user = user;
        sessionWishlist.anonymousId = null;
        session.anonymousId = null;
        return await this.wishlistRepository.save(sessionWishlist); 
    }

    // no session and no user wishlists
    const wishlist = this.wishlistRepository.create({ user, expiresAt: addDays(new Date(), 2) });
    return await this.wishlistRepository.save(wishlist);
  }

  async add(addToWishlistDto: ModifyWishlistDto, email: string, session: Record<string, any>): Promise<WishlistEntity> {
    const wishlist = await this.getOrCreateWishlist(email, session);
    await this.commonWishlistService.add(addToWishlistDto, wishlist);
    return wishlist;
  }
}
