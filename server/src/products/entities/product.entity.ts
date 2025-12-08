import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, ManyToOne, OneToMany, } from 'typeorm';
import { ProductImageEntity } from './product-image.entity.js';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity.js';
import { ProductAttributeValueEntity } from './product-attribute-value.entity.js';
import { CategoryEntity } from '../../categories/entities/category.entity.js';

@Entity({
    name: 'products'
})
export class ProductEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxSlugLength,
        unique: true
    })
    slug: string

    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxTitleLength
    })
    title: string

    @Column({
        name: 'short_description',
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxShortDescriptionLength
    })
    shortDescription: string

    @Column({ 
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxDescriptionLength
    })
    description: string

    @Column({
        default: 0,
        type: 'numeric'
    })
    price: number;

    @ManyToOne(() => CategoryEntity)
    category: CategoryEntity;

    @OneToMany(() => ProductImageEntity, (productImage: ProductImageEntity) => productImage.product)
    images: ProductImageEntity[];

    @ManyToOne(() => ProductTypeEntity, (productType: ProductTypeEntity) => productType.products)
    productType: ProductTypeEntity;

    @OneToMany(
        () => ProductAttributeValueEntity, 
        (productAttributeValue: ProductAttributeValueEntity) => productAttributeValue.product,
        { cascade: true }
    )
    attributeValues: ProductAttributeValueEntity[];

    
}
