import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity.js';
import { IdResourceService } from '../common/id-resource.service.js';
import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { ReviewImageEntity } from './entities/review-image.entity.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { ReviewView } from './views/review.view.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';

@Injectable()
export class ReviewsService extends IdResourceService<ReviewView>{
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ReviewImageEntity) private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewView) private readonly reviewViewRepository: Repository<ReviewView>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) { 
    super(reviewViewRepository, 'review');
  }
  
  async create(createReviewDto: CreateReviewDto, email: string): Promise<ReviewView> {
    const { productSlug, text, rating, images } = createReviewDto;
    
    const product = await this.productsService.findOneBySlug(productSlug); 
    const user = await this.usersService.findOneByEmail(email);

    const review = this.reviewRepository.create({product, author: user, text, rating, images: []});
    
    if (images.length > 0) {
        const imageEntities: ReviewImageEntity[] = images.map(url => this.reviewImageRepository.create({url, review}));
        review.images = imageEntities;
    }
 
    
    const savedReview = await this.reviewRepository.save(review);
    const reviewView = new ReviewView();
    reviewView.populateFromEntity(savedReview);
    return reviewView; 
  }


  async update(id: string, updateReviewDto: UpdateReviewDto, email: string): Promise<ReviewView> {
    // TODO: maybe some kind of review history logging on update.
    
    const review = await this.findOneById(id);
    if (email !== review.userEmail)
      throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN);
    const { text, rating } = updateReviewDto;
    let updateObject = {};
    if (text) deepMergeObjects(updateObject, {text});
    if (rating) deepMergeObjects(updateObject, {rating}); 
    await this.reviewRepository.update({id: review.id}, updateObject);
    Object.assign(review, updateObject);
    return review;
  }

  override async findAll(
    mergeSelectOptions: FindOptionsSelect<ReviewEntity> = {},
    orderOptions: FindOptionsOrder<ReviewEntity> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ReviewEntity> = {},
  ): Promise<ReviewView[]> {
    const qb = this.reviewRepository.createQueryBuilder('review');
    qb.andWhere(filterOptions);
    const reviews = await super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions);
    return reviews;
  }
  
  async findOneById(
      id: string, 
      mergeSelectOptions: FindOptionsSelect<ReviewView> = {},
      customRelations: string[] = []
  ): Promise<ReviewView> {
      const review = await super.findOneById(id, mergeSelectOptions, customRelations);
      // review.reviewVoteScore = await this.reviewsVoteService.getAggregatedVotes(review.id) ?? 0;
      return review;
  }
  
   
  async validateUserAndRemove(id: string, email: string): Promise<ReviewView> {
    // override generic removal logic with user checks
    const review = await this.findOneById(id);
    if (review.userEmail === email) {
        await this.reviewRepository.delete({id: review.id});
        return review;
    }
    const user = await this.usersService.findOneByEmail(email);
    if (!user.isAdmin)
        throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN);
    await this.reviewRepository.delete({id: review.id});
    return review;
  }
}
