import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewImageEntity, ReviewVoteEntity, ReviewEntity } from './entities/';
import { UsersModule } from '../users/users.module.js';
import { ProductsModule } from '../products/products.module.js';
import { ReviewsVoteService } from './reviews-vote.service.js';
import { ReviewView } from './views/review.view.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewImageEntity, 
      ReviewVoteEntity,
      ReviewEntity,
      ReviewView
    ]),
    UsersModule, 
    ProductsModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsVoteService],
})
export class ReviewsModule {}
