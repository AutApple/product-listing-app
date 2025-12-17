import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewImageEntity } from './entities/review-image.entity.js';
import { ReviewVoteEntity } from './entities/review-vote.entity.js';
import { ReviewEntity } from './entities/review.entity.js';
import { UsersModule } from '../users/users.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewImageEntity, 
      ReviewVoteEntity,
      ReviewEntity
    ]),
    UsersModule, 
    ProductsModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
