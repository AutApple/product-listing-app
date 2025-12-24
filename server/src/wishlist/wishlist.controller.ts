import { Controller, Get, Body, Session, UseGuards, Patch } from '@nestjs/common';
import { User, JwtPayload, OptionalGuard } from '../auth/';
import { toOutputDto } from '../common/';
import { OutputWishlistDto, ModifyWishlistDto, WishlistEntity } from './';
import { WishlistOrchestratorService } from './wishlist-orchestrator.service.js';
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
