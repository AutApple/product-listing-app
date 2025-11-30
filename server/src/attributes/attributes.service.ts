import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity.js';
import { FindManyOptions, FindOptionsSelect, Repository } from 'typeorm';
import { AttributeEnumValueEntity } from './entities/attribute-enum-value.entity.js';
import AttributeTypes from './types/attribute.types.enum.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';
import { extractRelationsFromSelect } from '../common/utils/extract-relations.js';
import { OutputAttributeDTO } from './dto/output/output-attribute.dto.js';

@Injectable()
export class AttributesService {
  constructor (
    @InjectRepository(AttributeEntity) private readonly attributeEntityRepository: Repository<AttributeEntity>
  ) {}

  private readonly defaultSelectOptions: FindOptionsSelect<AttributeEntity> = {
    id: true,
    slug: true,
    type: true,
    title: true,
    enumValues: {
        id: true,
        value: true
    }
  }

  async create(createAttributeDto: CreateAttributeDto): Promise<OutputAttributeDTO> {
    const {enumValues, ...attributeData} = createAttributeDto;
    const attribute: AttributeEntity = this.attributeEntityRepository.create(attributeData);
    attribute.enumValues = [];

    if (enumValues && attribute.type === AttributeTypes.ENUM)
        for (const value of enumValues)
          attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
    
    return new OutputAttributeDTO(await this.attributeEntityRepository.save(attribute));
  }

  async findAll(): Promise<OutputAttributeDTO[]> {
    const relations = extractRelationsFromSelect(this.defaultSelectOptions);
    const attributeEntities = await this.attributeEntityRepository.find({select: this.defaultSelectOptions, relations});
    return attributeEntities.map(v=>new OutputAttributeDTO(v));
  }

  async findOneBySlug(slug: string,  mergeSelectOptions: FindOptionsSelect<AttributeEntity> = {}): Promise<AttributeEntity> {
    const selectOptions = deepMergeObjects(this.defaultSelectOptions, mergeSelectOptions);
    const relations = extractRelationsFromSelect(selectOptions);
    
    
    const attribute = await this.attributeEntityRepository.findOne({where: {slug}, select: selectOptions, relations: relations});
    if(!attribute)
        throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('attribute', slug));      
    return attribute;
  
  }

  async findOneBySlugDTO(slug: string,  mergeSelectOptions: FindOptionsSelect<AttributeEntity> = {}) : Promise<OutputAttributeDTO> {
    return new OutputAttributeDTO(await this.findOneBySlug(slug, mergeSelectOptions));
  }
  
  async update(slug: string, updateAttributeDto: UpdateAttributeDto): Promise<OutputAttributeDTO> {
      const attribute = await this.findOneBySlug(slug);
      const {enumValues, ...attributeData} = updateAttributeDto;
      Object.assign(attribute, attributeData);
      if (enumValues && attribute.type === AttributeTypes.ENUM) {
        attribute.enumValues = [];
        for (const value of enumValues)
          attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
      }
      return new OutputAttributeDTO(await this.attributeEntityRepository.save(attribute));
  }

  async remove(slug: string): Promise<OutputAttributeDTO> {
    const attribute = await this.findOneBySlug(slug);
    await this.attributeEntityRepository.remove(attribute);
    return new OutputAttributeDTO(attribute);
  }
}
