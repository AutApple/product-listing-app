import { defaultValidationConfig } from '../../config/validation.config.js';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity.js';
import { AttributeEntity } from '../../attributes/entities/attribute.entity.js';

@Entity({
    name: 'product_types'
})
export class ProductTypeEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.productType.maxSlugLength,
    })
    @Index({ unique: true })
    slug: string; 

    @OneToMany(() => ProductEntity, (product) => product.productType)
    products: ProductEntity[];

    @ManyToMany(() => AttributeEntity, (attributeEntity: AttributeEntity) => attributeEntity.productTypes, { onDelete: 'CASCADE' })
    @JoinTable()
    attributes: AttributeEntity[];
}
