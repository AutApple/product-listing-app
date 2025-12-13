import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../auth/decorators/user.decorator.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputWishlistDto } from './dto/output/output-wishlist.dto.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  private dto(data: WishlistEntity) {
    return toOutputDto(data, OutputWishlistDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get() 
  async findWishlist(@User('email') email: string) {
    const data = await this.wishlistService.getOrCreateWishlist(email);
    return this.dto(data);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async addProducts(@Body() addToWishlistDto: ModifyWishlistDto, @User('email') email: string) {
    const data = await this.wishlistService.add(addToWishlistDto, email);
    return this.dto(data);
  }


}
