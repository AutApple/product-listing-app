import { Controller, Get, Post, Body, Session, UseGuards, Patch } from '@nestjs/common';
import { User } from '../auth/decorators/user.decorator.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputWishlistDto } from './dto/output/output-wishlist.dto.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';
import { WishlistOrchestratorService } from './wishlist-orchestrator.service.js';
import { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { OptionalGuard } from '../auth/guards/optional.guard.js';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistOrchestratorService: WishlistOrchestratorService) { }

  private dto(data: WishlistEntity) {
    return toOutputDto(data, OutputWishlistDto);
  }

  @ApiTags('Wishlist')
  @ApiOperation({summary: 'Get wishlist that is tied to the session (or user in case if auth bearer provided)'})
  @ApiOkResponse({type: OutputWishlistDto, description: 'Wishlist that is tied to the session (or user in case if auth bearer provided)'})
  @UseGuards(OptionalGuard)
  @Get()
  async findWishlist(
    @User() user: JwtPayload | undefined,
    @Session() session: Record<string, any>
  ) {
    const data = await this.wishlistOrchestratorService.get(session, user);
    return this.dto(data);
  }

  @ApiTags('Wishlist')
  @ApiOperation({summary: 'Update a wishlist that is tied to the session (or user in case if auth bearer provided)'})
  @ApiBody({type: ModifyWishlistDto, description: 'Add specified items to wishlist. In order to remove or reduce items use negative amount in WishlistItem'})
  @ApiOkResponse({type: OutputWishlistDto, description: 'Updated wishlist'})
  @UseGuards(OptionalGuard)
  @Patch()
  async addProducts(
    @Body() addToWishlistDto: ModifyWishlistDto, 
    @User() user: JwtPayload | undefined,
    @Session() session: Record<string, any>
  ) {
    const data = await this.wishlistOrchestratorService.add(addToWishlistDto, session, user);
    return this.dto(data);
  }
}
