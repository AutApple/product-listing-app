import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../auth/decorators/user.decorator.js';
import { ReviewEntity } from './entities/review.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputReviewDto } from './dto/output/output-review.dto.js';
import { ReviewsVoteService } from './reviews-vote.service.js';
import { VoteReviewDto } from './dto/vote-review.dto.js';
import { ReviewView } from './views/review.view.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { ParsedQuery } from '../query-parser/decorators/parsed-query.transformer.js';
import { QueryCommonDto } from '../common/dto/query.common.dto.js';
import type { QueryParserResult } from '../query-parser/query-parser.js';
import { ApiTags } from '@nestjs/swagger';
import { ApiCommonFindManyResources, ApiCommonFindOneResource } from '../swagger/decorators/common-find.decorator.js';
import { ApiCommonCreateResource } from '../swagger/decorators/common-create.decorator.js';
import { ApiAuthHeader } from '../swagger/decorators/auth-header.decorator.js';
import { ApiCommonUpdateResource } from '../swagger/decorators/common-update.decorator.js';
import { ApiCommonDeleteResource } from '../swagger/decorators/common-delete.decorator.js';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reviewsVoteService: ReviewsVoteService
  ) {}
  // TODO: describe status codes
  private dto(e: ReviewView | ReviewView[]) {
    return toOutputDto(e, OutputReviewDto);
  }

  @ApiCommonCreateResource('review', CreateReviewDto, OutputReviewDto, false)
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @User('email') email: string) {
    const data = await this.reviewsService.create(createReviewDto, email);
    return this.dto(data);
  }

  @ApiCommonUpdateResource('review', CreateReviewDto, OutputReviewDto, false)
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @User('email') email: string) {
    return this.reviewsService.update(id, updateReviewDto, email);
  }
  
  @ApiCommonDeleteResource('review', OutputReviewDto, false)
  @ApiAuthHeader()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User('email') email: string) {
    return this.reviewsService.validateUserAndRemove(id, email);
  }


  @ApiCommonFindManyResources('review', OutputReviewDto)
  @Get()
  async findAll(@ParsedQuery({ config: globalQueryParserConfig.reviews, dto: QueryCommonDto }) queryResult: QueryParserResult) {
    const data = await this.reviewsService.findAll(
      queryResult.selectOptions ?? {},
      queryResult.orderOptions ?? {},
      queryResult.paginationOptions?.skip ?? 0,
      queryResult.paginationOptions?.take ?? 10,
      queryResult.filterOptions ?? {}
    );
    
    return this.dto(data);
  }

  @ApiCommonFindOneResource('review', OutputReviewDto, 'id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await  this.reviewsService.findOneById(id);
    return this.dto(data);
  }

  @ApiTags('Review / Vote')
  @UseGuards(AccessTokenGuard)
  @Patch(':id/vote')
  async vote(@Body() voteReviewDto: VoteReviewDto, @Param('id') id: string, @User('email') email: string) {
    return await this.reviewsVoteService.vote(voteReviewDto.vote, id, email);
  }

  @ApiTags('Review / Vote')
  @UseGuards(AccessTokenGuard)
  @Delete(':id/vote')
  async removeVote(@Param('id') id: string, @User('email') email: string) {
    return await this.reviewsVoteService.remove(id, email);
  } 


}
