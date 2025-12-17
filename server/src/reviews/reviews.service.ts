import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity.js';
import { IdResourceService } from '../common/id-resource.service.js';
import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service.js';
import { UsersService } from '../users/users.service.js';
import { ReviewImageEntity } from './entities/review-image.entity.js';

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
        await this.reviewImageRepository.save(imageEntities);
        review.images = imageEntities;
    }
 
    
    return await this.reviewRepository.save(review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, email: string) {
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
  
   
  async removeSelf(slug: string, email: string): Promise<ReviewEntity> {
    return super.remove(slug);
  }
}
