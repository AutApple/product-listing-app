import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { Repository } from 'typeorm';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributesService } from '../attributes/attributes.service.js';

@Injectable()
export class ProductTypesService {
  constructor (
    @InjectRepository(ProductTypeEntity) private readonly productTypeRepository: Repository<ProductTypeEntity>,
    private readonly attributesService: AttributesService
  ) {}
  
  async create(createProductTypeDto: CreateProductTypeDto): Promise<ProductTypeEntity> {
    const {attributes, ...productTypeData} = createProductTypeDto;
    const productType = this.productTypeRepository.create(productTypeData);
    productType.attributes = [];

    if(attributes.length > 0)
      for (const attributeSlug of attributes) { 
          const attribute = await this.attributesService.findOneBySlug(attributeSlug);
          productType.attributes.push(attribute);  
      }

    return await this.productTypeRepository.save(productType); 
  }

  async findAll(): Promise<ProductTypeEntity[]> {
    return await this.productTypeRepository.find({relations: {attributes: true}});
  }

  async findOneBySlug(slug: string): Promise<ProductTypeEntity> {
    const productType = await this.productTypeRepository.findOne({where: {slug}, select: {createdAt: false, updatedAt: false}, relations: ['attributes', 'attributes.enumValues']});
    if(!productType)
        throw new NotFoundException('Product type with given slug not found');
    return productType;
  }

  async update(slug: string, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductTypeEntity> {
    const {attributes, ...productTypeData} = updateProductTypeDto;
    const productType = await this.findOneBySlug(slug);

    Object.assign(productType, productTypeData);

    if(attributes && attributes.length > 0) {
      productType.attributes = [];
      for (const attributeSlug of attributes) { 
          const attribute = await this.attributesService.findOneBySlug(attributeSlug);
          productType.attributes.push(attribute);  
      }
    }

    return await this.productTypeRepository.save(productType);
  }

  async remove(slug: string): Promise<ProductTypeEntity> {
    const productType = await this.findOneBySlug(slug);
    await this.productTypeRepository.remove(productType);
    return productType;
  }
}
