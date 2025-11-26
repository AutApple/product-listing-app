import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, OneToMany } from 'typeorm';
import AttributeTypes from '../types/attribute.types.enum.js';
import { AttributeEnumValueEntity } from './attribute-enum-value.entity.js';

@Entity({
    name: 'attributes'
})
export class AttributeEntity extends AbstractEntity{
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.attribute.maxSlugLength,
        unique: true
    })
    slug: string;

    @Column({
        type: 'varchar',
        length: defaultValidationConfig.attribute.maxTitleLength
    })
    title: string; 

    @Column({
        type: 'enum',
        enum: AttributeTypes
    })
    type: string;
    
    @OneToMany(() => AttributeEnumValueEntity, (enumValue: AttributeEnumValueEntity) => enumValue.attribute)
    enumValues: AttributeEnumValueEntity[];
    
}
