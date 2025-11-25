import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto.js';
import { QueryHelperService } from '../common/services/query-helper.service.js';
import { ProductImageEntity } from './entities/product-image.entity.js';
import { ProductTypesService } from '../product-types/product-types.service.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity) private readonly productImageRepository: Repository<ProductImageEntity>,
    private readonly queryHelperService: QueryHelperService,
    private readonly productTypesService: ProductTypesService
  ) {}

  
  async create(createProductDto: CreateProductDto) {
    const {imageUrls, productTypeSlug, ...productData} = createProductDto;
    const productType = await this.productTypesService.findOneBySlug(productTypeSlug);

    const product: ProductEntity = this.productRepository.create(productData);
    product.productType = productType;
   
    await this.productRepository.save(product);

    if (imageUrls && imageUrls.length) { // if there are any image urls specified, create entities for them
        const images = imageUrls.map(url => this.productImageRepository.create({url, product}));
        await this.productImageRepository.save(images);
        product.images = images;  
    }

    return product;
  }

  async findAll(queryProductDto: QueryProductDto): Promise<ProductEntity[]> {
    let orderOptions = {};
    if(queryProductDto.sort)
      for (const s of queryProductDto.sort)
        Object.assign(orderOptions, this.queryHelperService.sortOptionToKeyValue(s));
    
    return await this.productRepository.find({ order: orderOptions, relations: {images: true} });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({id});
    if(!product)
      throw new NotFoundException('Can\'t find a product with specified ID');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOne(id);    
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }
}
