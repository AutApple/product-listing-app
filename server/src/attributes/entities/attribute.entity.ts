import { Exclude } from 'class-transformer';
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity.js';
import { ProductAttributeValueEntity } from '../../products/entities/product-attribute-value.entity.js';
import { AttributeTypes } from '../types/attribute.types.enum.js';
import { AttributeEnumValueEntity } from './attribute-enum-value.entity.js';

@Entity({
    name: 'attributes'
})
export class AttributeEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: 255,
    })
    @Index({ unique: true })
    slug: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    title: string;

    @Column({
        type: 'enum',
        enum: AttributeTypes
    })
    type: string;

    @OneToMany(() => AttributeEnumValueEntity, (enumValue: AttributeEnumValueEntity) => enumValue.attribute, { cascade: true })
    enumValues: AttributeEnumValueEntity[];

    @ManyToMany(() => ProductTypeEntity, (productType: ProductTypeEntity) => productType.attributes)
    @Exclude({ toPlainOnly: true })
    productTypes: ProductTypeEntity;

    @OneToMany(() => ProductAttributeValueEntity, (productAttributeValue: ProductAttributeValueEntity) => productAttributeValue.attribute)
    attributeValues: ProductAttributeValueEntity[];
}
