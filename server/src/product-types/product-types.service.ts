import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductTypeDto, UpdateProductTypeDto, ProductTypeEntity } from './';
import { EntityManager, FindOptionsOrder, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from '../attributes/';
import { SlugResourceService } from '../common/';
import { AttributesService } from '../attributes/attributes.service.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

@Injectable()
export class ProductTypesService extends SlugResourceService<ProductTypeEntity> {
  constructor(
    @InjectRepository(ProductTypeEntity) private readonly productTypeRepository: Repository<ProductTypeEntity>,
    private readonly attributesService: AttributesService
  ) {
    super(productTypeRepository, 'product type');
  }

  protected readonly defaultSelectOptions: FindOptionsSelect<ProductTypeEntity> = {
    id: true,
    slug: true,
    createdAt: false,
    updatedAt: false,
    attributes: {
      id: true,
      slug: true,
      type: true,
      enumValues: {
        id: true,
        value: true
      }
    }
  };

  private async makeAttributes(attributes: string[]): Promise<AttributeEntity[]> {
    const entities: AttributeEntity[] = [];
    if (!attributes || attributes.length === 0)
      return entities;
    for (const attributeSlug of attributes) {
      const attribute = await this.attributesService.findOneBySlug(attributeSlug, {id: true});
      entities.push(attribute);
    }
    return entities;
  }
  
  async create(createProductTypeDto: CreateProductTypeDto | CreateProductTypeDto[]): Promise<ProductTypeEntity | ProductTypeEntity[]> {
    const dtos: CreateProductTypeDto[] = Array.isArray(createProductTypeDto) ? createProductTypeDto : [createProductTypeDto];
    const productTypes: ProductTypeEntity[] = [];
    await this.productTypeRepository.manager.transaction(async (entityManager: EntityManager) => {
      for (const dto of dtos) {
        const { attributes, ...productTypeData } = dto;
        const productType = this.productTypeRepository.create(productTypeData);
        productType.attributes = await this.makeAttributes(attributes);
        productTypes.push(await entityManager.save(productType));
      }
    });

    return productTypes.length === 1 ? productTypes[0] : productTypes;
  }

  async update(slug: string, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductTypeEntity> {
    const { attributes, slug: newSlug } = updateProductTypeDto;
    const productType = await this.findOneBySlug(slug, {
      attributes: {
        id: true,
        enumValues: {
          id: true
        }
      }
    });

    if (newSlug) {
      if (await this.findOneBySlug(newSlug))
        throw new ConflictException(ERROR_MESSAGES.DB_UNIQUE_CONSTRAINT_VIOLATION());
      productType.slug = newSlug;
    }
    
    if (attributes && attributes.length > 0)
      productType.attributes = await this.makeAttributes(attributes);

    return await this.productTypeRepository.save(productType);
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {},
    orderOptions: FindOptionsOrder<ProductTypeEntity> = {},
    skip: number = 0,
    take: number = 10
  ): Promise<ProductTypeEntity[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take);
  }

  async findOneBySlug(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {}
  ): Promise<ProductTypeEntity> {
    return super.findOneBySlug(slug, mergeSelectOptions);
  }

 
  async remove(slug: string): Promise<ProductTypeEntity> {
    return super.remove(slug);
  }

}
