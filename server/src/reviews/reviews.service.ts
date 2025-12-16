import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity.js';
import { IdResourceService } from '../common/id-resource.service.js';
import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewsService extends IdResourceService<ReviewEntity>{
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity> 
  ) { 
    super(reviewRepository, 'review');
  }
  
  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }
  update(id: string, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ReviewEntity> = {},
    orderOptions: FindOptionsOrder<ReviewEntity> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ReviewEntity> = {},
  ): Promise<ReviewEntity[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions);
  }
  
  async findOneById(
      slug: string, 
      mergeSelectOptions: FindOptionsSelect<ReviewEntity> = {},
      customRelations: string[] = []
  ): Promise<ReviewEntity> {
      return super.findOneById(slug, mergeSelectOptions, customRelations);
  }
  
   
  async remove(slug: string): Promise<ReviewEntity> {
    return super.remove(slug);
  }
}
