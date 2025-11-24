import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { QueryProductDto } from './dto/query-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>) {}

  private sortOptionToKeyValue(sort_option: string): { [key: string]: 'ASC' | 'DESC'} { //Convert sorting options into TypeORM ordering format
      const isDesc: boolean = (sort_option.charAt(0) === '-');
      const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
      const key: string = isDesc ?  sort_option.slice(1) : sort_option;
      return { [key]: value }
  }
  
  async create(createProductDto: CreateProductDto) {
    const product: ProductEntity = await this.productRepository.save(createProductDto);
    return product;
  }

  async findAll(queryProductDto: QueryProductDto): Promise<ProductEntity[]> {
    let orderOptions = {};
    if(queryProductDto.sort)
      for (const s of queryProductDto.sort)
        Object.assign(orderOptions, this.sortOptionToKeyValue(s));
    
    return await this.productRepository.find({ order: orderOptions});
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
