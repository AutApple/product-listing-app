import { Body, Controller, Get, Post, Req, Session } from '@nestjs/common';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { OutputWishlistDto } from './dto/output/output-wishlist.dto.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { GuestWishlistService } from './guest-wishlist.service.js';
import type { Request } from 'express';

@Controller('wishlist')
export class GuestWishlistController {
  constructor(private readonly guestWishlistService: GuestWishlistService) {}

  private dto(data: WishlistEntity) {
    return toOutputDto(data, OutputWishlistDto);
  }

  @Get('guest') 
  async findWishlist(@Req() req: Request) {
    const data = await this.guestWishlistService.getOrCreateWishlist(req.session);
    return this.dto(data);
  }

  @Post('guest')
  async addProducts(@Body() addToWishlistDto: ModifyWishlistDto, @Req() req: Request) {
    const data = await this.guestWishlistService.add(addToWishlistDto, req.session);
    return this.dto(data);
  }


}
