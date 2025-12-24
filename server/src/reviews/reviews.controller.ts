import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { User, AccessTokenGuard } from '../auth/';
import { toOutputDto, QueryCommonDto } from '../common/';
import { OutputReviewDto, VoteReviewDto, ReviewView, CreateReviewDto, UpdateReviewDto } from './';
import { ReviewsVoteService } from './reviews-vote.service.js';
import { globalQueryParserConfig } from '../config/query-parser.config.js';
import { ParsedQuery, type QueryParserResult } from '../query-parser/';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiCommonFindManyResources, ApiCommonFindOneResource, ApiAuthHeader, ApiCommonCreateResource, ApiCommonDeleteResource, ApiCommonUpdateResource } from '../swagger/';

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

  @ApiCommonCreateResource('review', CreateReviewDto, OutputReviewDto, false, false)
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
  @ApiOperation({
    summary: 'Upsert a vote for a review with given ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Id of a review'
  })
  @ApiOkResponse({
    type: VoteReviewDto,
    description: 'Upserted vote review entity'
  })
  @UseGuards(AccessTokenGuard)
  @Patch(':id/vote')
  async vote(@Body() voteReviewDto: VoteReviewDto, @Param('id') id: string, @User('email') email: string) {
    return await this.reviewsVoteService.vote(voteReviewDto.vote, id, email);
  }

  @ApiTags('Review / Vote')
  @ApiOperation({
    summary: 'Delete a vote for a review with given ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Id of a review'
  })
  @ApiOkResponse({
    type: VoteReviewDto,
    description: 'Deleted vote review entity'
  })
  @UseGuards(AccessTokenGuard)
  @Delete(':id/vote')
  async removeVote(@Param('id') id: string, @User('email') email: string) {
    return await this.reviewsVoteService.remove(id, email);
  } 


}
