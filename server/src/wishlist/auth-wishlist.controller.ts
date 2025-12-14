import { Controller, Get, Post, Body, UseGuards, Session } from '@nestjs/common';
import { AuthWishlistService } from './auth-wishlist.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../auth/decorators/user.decorator.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputWishlistDto } from './dto/output/output-wishlist.dto.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';

@Controller('wishlist')
export class AuthWishlistController {
  constructor(private readonly authWishlistService: AuthWishlistService) { }

  private dto(data: WishlistEntity) {
    return toOutputDto(data, OutputWishlistDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findWishlist(
    @User('email') email: string,
    @Session() session: Record<string, any>
  ) {
    const data = await this.authWishlistService.getOrCreateWishlist(email, session);
    return this.dto(data);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async addProducts(
    @Body() addToWishlistDto: ModifyWishlistDto, 
    @User('email') email: string,
    @Session() session: Record<string, any>
  ) {
    const data = await this.authWishlistService.add(addToWishlistDto, email, session);
    return this.dto(data);
  }


}
