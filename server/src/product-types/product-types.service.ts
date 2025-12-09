import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { EntityManager, FindOptionsOrder, FindOptionsSelect, Repository } from 'typeorm';
import { ProductTypeEntity } from './entities/product-type.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributesService } from '../attributes/attributes.service.js';
import { OutputProductTypeDTO } from './dto/output/output-product-type.dto.js';
import { BaseService } from '../common/base.service.js';
import { AttributeEntity } from '../attributes/entities/attribute.entity.js';

@Injectable()
export class ProductTypesService extends BaseService<ProductTypeEntity, OutputProductTypeDTO> {
  constructor(
    @InjectRepository(ProductTypeEntity) private readonly productTypeRepository: Repository<ProductTypeEntity>,
    private readonly attributesService: AttributesService
  ) {
    super(productTypeRepository, OutputProductTypeDTO, 'product type');
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
  
  async create(createProductTypeDto: CreateProductTypeDto | CreateProductTypeDto[]): Promise<OutputProductTypeDTO | OutputProductTypeDTO[]> {
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

    return productTypes.length === 1 ? new OutputProductTypeDTO(productTypes[0]) : productTypes.map(pt => new OutputProductTypeDTO(pt));
  }

  async update(slug: string, updateProductTypeDto: UpdateProductTypeDto): Promise<OutputProductTypeDTO> {
    const { attributes, ...productTypeData } = updateProductTypeDto;
    const productType = await this.findOneBySlug(slug, {
      attributes: {
        id: true,
        enumValues: {
          id: true
        }
      }
    });

    Object.assign(productType, productTypeData);

    if (attributes && attributes.length > 0)
      productType.attributes = await this.makeAttributes(attributes);


    return new OutputProductTypeDTO(await this.productTypeRepository.save(productType));
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {},
    orderOptions: FindOptionsOrder<ProductTypeEntity> = {},
    skip: number = 0,
    take: number = 10
  ): Promise<OutputProductTypeDTO[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take);
  }

  async findOneBySlug(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {}
  ): Promise<ProductTypeEntity> {
    return super.findOneBySlug(slug, mergeSelectOptions);
  }

  async findOneBySlugDTO(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<ProductTypeEntity> = {}
  ): Promise<OutputProductTypeDTO> {
    return super.findOneBySlugDTO(slug, mergeSelectOptions);
  }

  async remove(slug: string): Promise<OutputProductTypeDTO> {
    return super.remove(slug);
  }

}
