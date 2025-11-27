import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity.js';
import { Repository } from 'typeorm';
import { AttributeEnumValueEntity } from './entities/attribute-enum-value.entity.js';
import AttributeTypes from './types/attribute.types.enum.js';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AttributesService {
  constructor (
    @InjectRepository(AttributeEntity) private readonly attributeEntityRepository: Repository<AttributeEntity>
  ) {}


  async create(createAttributeDto: CreateAttributeDto): Promise<AttributeEntity> {
    const {enumValues, ...attributeData} = createAttributeDto;
    const attribute: AttributeEntity = this.attributeEntityRepository.create(attributeData);
    attribute.enumValues = [];

    if (enumValues && attribute.type === AttributeTypes.ENUM)
        for (const value of enumValues)
          attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
    
    return await this.attributeEntityRepository.save(attribute);
  }

  async findAll(): Promise<AttributeEntity[]> {
    return this.attributeEntityRepository.find({});
  }

  async findOneBySlug(slug: string): Promise<AttributeEntity> {
    const attribute = await this.attributeEntityRepository.findOneBy({slug});
    if(!attribute)
        throw new NotFoundException('Attribute with specified slug is not found');      
    return attribute;
  }

  async update(slug: string, updateAttributeDto: UpdateAttributeDto): Promise<AttributeEntity> {
      const attribute = await this.findOneBySlug(slug);
      const {enumValues, ...attributeData} = updateAttributeDto;
      Object.assign(attribute, attributeData);
      if (enumValues && attribute.type === AttributeTypes.ENUM){
        attribute.enumValues = [];
        for (const value of enumValues)
          attribute.enumValues.push(new AttributeEnumValueEntity(value, attribute));
      }
      return await this.attributeEntityRepository.save(attribute);
  }

  async remove(slug: string): Promise<AttributeEntity> {
    const attribute = await this.findOneBySlug(slug);
    await this.attributeEntityRepository.remove(attribute);
    return attribute;
  }
}
