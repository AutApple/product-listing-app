import { Controller, Get, Post, Body, Session, UseGuards } from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputWishlistDto } from './dto/output/output-wishlist.dto.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { WishlistOrchestratorService } from './wishlist-orchestrator.service.js';
import { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { OptionalGuard } from '../auth/guards/optional.guard.js';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistOrchestratorService: WishlistOrchestratorService) { }

  private dto(data: WishlistEntity) {
    return toOutputDto(data, OutputWishlistDto);
  }

  @UseGuards(OptionalGuard)
  @Get()
  async findWishlist(
    @User() user: JwtPayload | undefined,
    @Session() session: Record<string, any>
  ) {
    const data = await this.wishlistOrchestratorService.get(session, user);
    return this.dto(data);
  }

  @UseGuards(OptionalGuard)
  @Post()
  async addProducts(
    @Body() addToWishlistDto: ModifyWishlistDto, 
    @User() user: JwtPayload | undefined,
    @Session() session: Record<string, any>
  ) {
    const data = await this.wishlistOrchestratorService.add(addToWishlistDto, session, user);
    return this.dto(data);
  }
}
