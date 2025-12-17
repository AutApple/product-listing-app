import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { User } from '../auth/decorators/user.decorator.js';
import { ReviewEntity } from './entities/review.entity.js';
import { toOutputDto } from '../common/utils/to-output-dto.js';
import { OutputReviewDto } from './dto/output/output-review.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  
  private dto(e: ReviewEntity | ReviewEntity[]) {
    return toOutputDto(e, OutputReviewDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @User('email') email: string) {
    const data = await this.reviewsService.create(createReviewDto, email);
    return this.dto(data);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @User('email') email: string) {
    return this.reviewsService.update(id, updateReviewDto, email);
  }
  
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User('email') email: string) {
    return this.reviewsService.validateUserAndRemove(id, email);
  }


  @Get()
  async findAll() {
    const data = await this.reviewsService.findAll();
    return this.dto(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await  this.reviewsService.findOneById(id);
    return this.dto(data);
  }

}
