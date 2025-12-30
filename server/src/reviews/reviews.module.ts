import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ReviewVoteEntity, ReviewEntity } from './entities/';
import { UsersModule } from '../users/users.module.js';
import { ProductsModule } from '../products/products.module.js';
import { ReviewsVoteService } from './reviews-vote.service.js';
import { ReviewView } from './views/review.view.js';
import { ImagesModule } from '../images/images.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewVoteEntity,
      ReviewEntity,
      ReviewView
    ]),
    UsersModule, 
    ProductsModule,
    ImagesModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsVoteService],
})
export class ReviewsModule {}
