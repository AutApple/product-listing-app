import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>) {}

  async create(createProductDto: CreateProductDto) {
    const product: ProductEntity = await this.productRepository.save(createProductDto);
    return product;
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({});
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
