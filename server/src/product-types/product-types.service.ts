import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { Repository } from 'typeorm';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductTypesService {
  constructor (
    @InjectRepository(ProductTypeEntity) private readonly productTypeRepository: Repository<ProductTypeEntity>
  ) {}
  
  async create(createProductTypeDto: CreateProductTypeDto): Promise<ProductTypeEntity> {
    return await this.productTypeRepository.save(createProductTypeDto); 
  }

  async findAll(): Promise<ProductTypeEntity[]> {
    return await this.productTypeRepository.find({relations: {products: true}});
  }

  async findOneBySlug(slug: string): Promise<ProductTypeEntity> {
    const productType = await this.productTypeRepository.findOne({where: {slug}, relations: {products: true}});
    if(!productType)
        throw new NotFoundException('Product type with given slug not found');
    return productType;
  }

  async update(slug: string, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductTypeEntity> {
    const productType = await this.findOneBySlug(slug);
    Object.assign(productType, updateProductTypeDto);
    return await this.productTypeRepository.save(productType);
  }

  async remove(slug: string): Promise<ProductTypeEntity> {
    const productType = await this.findOneBySlug(slug);
    await this.productTypeRepository.remove(productType);
    return productType;
  }
}
