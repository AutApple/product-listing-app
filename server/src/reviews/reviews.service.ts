import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto, ReviewEntity, ReviewView } from './';
import { IdResourceService, deepMergeObjects } from '../common/';
import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { ImagesService } from '../images/images.service.js';
import { ImageEntity } from '../images/index.js';

@Injectable()
export class ReviewsService extends IdResourceService<ReviewView>{
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly imagesService: ImagesService,
    @InjectRepository(ReviewView) private readonly reviewViewRepository: Repository<ReviewView>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) { 
    super(reviewViewRepository, 'review', false);
  }
  
  async create(createReviewDto: CreateReviewDto, email: string): Promise<ReviewView> {
    const { productSlug, text, rating, imageSlugs } = createReviewDto;
    
    const product = await this.productsService.findEntityBySlug(productSlug); 
    const user = await this.usersService.findOneByEmail(email);

    const review = this.reviewRepository.create({product, author: user, text, rating, images: []});
    
    if (imageSlugs.length > 0) {
        const imageEntities: ImageEntity[] = await this.imagesService.getBySlugs(imageSlugs, email);
        review.images = imageEntities;
    }
     
    const savedReview = await this.reviewRepository.save(review);;
    return ReviewView.generateFromEntity(savedReview); 
  }


  async update(id: string, updateReviewDto: UpdateReviewDto, email: string): Promise<ReviewView> {
    // TODO: some kind of review history logging on update. 
    const review = await this.findOneById(id);
    if (email !== review.userEmail)
      throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN());
    const { text, rating, imageSlugs } = updateReviewDto;
    
    let updateObject = {};
    
    if (text) deepMergeObjects(updateObject, {text});
    if (rating) deepMergeObjects(updateObject, {rating}); 
    if (imageSlugs) deepMergeObjects(updateObject, { images: await this.imagesService.getBySlugs(imageSlugs, email) });
    
    await this.reviewRepository.update({id: review.id}, updateObject);
    Object.assign(review, updateObject);
    return review;
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ReviewView> = {},
    orderOptions: FindOptionsOrder<ReviewView> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ReviewView> = {},
  ): Promise<ReviewView[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions);
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
        throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN());
    await this.reviewRepository.delete({id: review.id});
    return review;
  }
}
