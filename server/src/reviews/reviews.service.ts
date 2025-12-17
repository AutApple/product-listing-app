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

@Injectable()
export class ReviewsService extends IdResourceService<ReviewEntity>{
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ReviewImageEntity) private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService 
  ) { 
    super(reviewRepository, 'review');
  }
  
  async create(createReviewDto: CreateReviewDto, email: string) {
    const { productSlug, text, rating, images } = createReviewDto;
    
    const product = await this.productsService.findOneBySlug(productSlug); 
    const user = await this.usersService.findOneByEmail(email);

    const review = this.reviewRepository.create({product, author: user, text, rating, images: []});
    
    if (images.length > 0) {
        const imageEntities: ReviewImageEntity[] = images.map(url => this.reviewImageRepository.create({url, review}));
        review.images = imageEntities;
    }
 
    
    return await this.reviewRepository.save(review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, email: string) {
    // TODO: maybe some kind of review history logging on update.
    const review = await this.findOneById(id);
    const { text, rating } = updateReviewDto;
    if (text) review.text = text;
    if (rating) review.rating = rating; 
    return await this.reviewRepository.save(review);
  }

  

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ReviewEntity> = {},
    orderOptions: FindOptionsOrder<ReviewEntity> = {},
    skip: number = 0,
    take: number = 10,
    filterOptions: FindOptionsWhere<ReviewEntity> = {},
  ): Promise<ReviewEntity[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take, filterOptions, ['product', 'author', 'images']);
  }
  
  async findOneById(
      id: string, 
      mergeSelectOptions: FindOptionsSelect<ReviewEntity> = {},
      customRelations: string[] = []
  ): Promise<ReviewEntity> {
      const r = [...customRelations, 'product', 'author', 'images']
      return super.findOneById(id, mergeSelectOptions, r);
  }
  
   
  async removeSelf(id: string, email: string): Promise<ReviewEntity> {
    // override generic removal logic with user checks
    const review = await this.findOneById(id);
    if (review.author.email === email) {
        await this.reviewRepository.remove(review);
        return review;
    }
    const user = await this.usersService.findOneByEmail(email);
    if (!user.isAdmin)
        throw new ForbiddenException(ERROR_MESSAGES.AUTH_FORBIDDEN);
    await this.reviewRepository.remove(review);
    return review;
  }
}
