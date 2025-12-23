import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { AttributeTypes } from '../types/attribute.types.enum.js';
import { AttributeEnumValueEntity } from './attribute-enum-value.entity.js';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity.js';
import { Exclude } from 'class-transformer';
import { ProductAttributeValueEntity } from '../../products/entities/product-attribute-value.entity.js';

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
    
    @OneToMany(() => AttributeEnumValueEntity, (enumValue: AttributeEnumValueEntity) => enumValue.attribute, {cascade: true})
    enumValues: AttributeEnumValueEntity[];
    
    @ManyToMany(() => ProductTypeEntity, (productType: ProductTypeEntity) => productType.attributes)
    @Exclude({ toPlainOnly: true }) 
    productTypes: ProductTypeEntity;

    @OneToMany(() => ProductAttributeValueEntity, (productAttributeValue: ProductAttributeValueEntity) => productAttributeValue.attribute)
    attributeValues: ProductAttributeValueEntity[];
    
}
