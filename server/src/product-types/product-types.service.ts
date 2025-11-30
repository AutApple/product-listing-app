import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { FindOptionsSelect, Repository } from 'typeorm';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributesService } from '../attributes/attributes.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { extractRelationsFromSelect } from '../common/utils/extract-relations.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';

@Injectable()
export class ProductTypesService {
  constructor (
    @InjectRepository(ProductTypeEntity) private readonly productTypeRepository: Repository<ProductTypeEntity>,
    private readonly attributesService: AttributesService
  ) {}
  
  private readonly defaultSelectOptions: FindOptionsSelect<ProductTypeEntity> = {
      id: true,
      slug: true,
      createdAt: false,
      updatedAt: false,
      attributes: {
        id: false,
        slug: true,
        type: true,
        enumValues: {
          id: false,
          value: true
        }
      }  
  }
  
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

  async findOneBySlug(slug: string, mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {}): Promise<ProductTypeEntity> {
    const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
    const relations = extractRelationsFromSelect(selectOptions);
          
    const productType = await this.productTypeRepository.findOne({where: {slug}, select: selectOptions, relations});
    if(!productType)
        throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('product type', slug));
    return productType;
  }

  async update(slug: string, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductTypeEntity> {
    const {attributes, ...productTypeData} = updateProductTypeDto;
    const productType = await this.findOneBySlug(slug, {
      attributes: {
        id: true,
        enumValues: {
          id: true
        }
      }
    });

    Object.assign(productType, productTypeData);

    if(attributes && attributes.length > 0) {
      productType.attributes = [];
      for (const attributeSlug of attributes) { 
          const attribute = await this.attributesService.findOneBySlug(attributeSlug,
            {
              id: true
            }
          );
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
