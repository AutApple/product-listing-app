import { Injectable } from '@nestjs/common';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsSelect, Repository } from 'typeorm';
import { AttributeEnumValueEntity, AttributeEntity, AttributeTypes } from './';
import { SlugResourceService } from '../common/slug-resource.service.js';

@Injectable()
export class AttributesService extends SlugResourceService<AttributeEntity> {
  constructor(
    @InjectRepository(AttributeEntity) private readonly attributeEntityRepository: Repository<AttributeEntity>
  ) {
    super(attributeEntityRepository, 'attribute');
  }

  protected readonly defaultSelectOptions: FindOptionsSelect<AttributeEntity> = {
    id: true,
    slug: true,
    type: true,
    title: true,
    enumValues: {
      id: true,
      value: true
    }
  };

  async create(createAttributeDto: CreateAttributeDto | CreateAttributeDto[]): Promise<AttributeEntity | AttributeEntity[]> {
    const dtos: CreateAttributeDto[] = Array.isArray(createAttributeDto) ? createAttributeDto : [createAttributeDto];
    const attributes: AttributeEntity[] = [];

    await this.attributeEntityRepository.manager.transaction(async (entityManager: EntityManager) => {
      for (const dto of dtos) {
        const { enumValues, ...attributeData } = dto;
        const attribute: AttributeEntity = this.attributeEntityRepository.create(attributeData);
        attribute.enumValues = [];

        if (enumValues && attribute.type === AttributeTypes.ENUM)
          for (const value of enumValues)
            attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
        attributes.push(await entityManager.save(attribute));
      }
    });

    return attributes.length === 1 ? attributes[0] : attributes;
  }

  async update(slug: string, updateAttributeDto: UpdateAttributeDto): Promise<AttributeEntity> {
    const attribute = await this.findOneBySlug(slug);
    const { enumValues, ...attributeData } = updateAttributeDto;
    Object.assign(attribute, attributeData);
    if (enumValues && attribute.type === AttributeTypes.ENUM) {
      attribute.enumValues = [];
      for (const value of enumValues)
        attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
    }
    return await this.attributeEntityRepository.save(attribute);
  }

  async findAll(
    mergeSelectOptions: FindOptionsSelect<AttributeEntity> = {},
    orderOptions: FindOptionsOrder<AttributeEntity> = {},
    skip: number = 0,
    take: number = 10
  ): Promise<AttributeEntity[]> {
    return super.findAll(mergeSelectOptions, orderOptions, skip, take);
  }

  async findOneBySlug(
    slug: string,
    mergeSelectOptions: FindOptionsSelect<AttributeEntity> = {}
  ): Promise<AttributeEntity> {
    return super.findOneBySlug(slug, mergeSelectOptions);
  }


  async remove(slug: string): Promise<AttributeEntity> {
    return super.remove(slug);
  }
}
