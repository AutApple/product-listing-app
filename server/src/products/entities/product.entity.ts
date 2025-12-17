import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import defaultValidationConfig from '../../config/validation.config.js';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, } from 'typeorm';
import { ProductImageEntity } from './product-image.entity.js';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity.js';
import { ProductAttributeValueEntity } from './product-attribute-value.entity.js';
import { CategoryEntity } from '../../categories/entities/category.entity.js';
import { WishlistItemEntity } from '../../wishlist/entities/wishlist-item.entity.js';
import { ReviewEntity } from '../../reviews/entities/review.entity.js';

@Entity({
    name: 'products'
})
export class ProductEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxSlugLength,
        unique: true
    })
    slug: string;

    @Column({
        type: 'varchar',
        length: defaultValidationConfig.product.maxTitleLength
    })
    title: string;

    @Column({
        name: 'short_description',
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxShortDescriptionLength
    })
    shortDescription: string;

    @Column({
        default: 'No description specified.',
        type: 'varchar',
        length: defaultValidationConfig.product.maxDescriptionLength
    })
    description: string;

    @Column({
        default: 0,
        type: 'numeric'
    })
    price: number;

    @ManyToOne(() => CategoryEntity)
    category: CategoryEntity;

    @OneToMany(() => ProductImageEntity, (productImage: ProductImageEntity) => productImage.product, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    images: ProductImageEntity[];

    @ManyToOne(() => ProductTypeEntity, (productType: ProductTypeEntity) => productType.products)
    productType: ProductTypeEntity;


    @OneToMany(() => WishlistItemEntity, w => w.product)
    wishlistItems: WishlistItemEntity[];

    @OneToMany(
        () => ProductAttributeValueEntity,
        (productAttributeValue: ProductAttributeValueEntity) => productAttributeValue.product,
        { cascade: true }
    )
    attributeValues: ProductAttributeValueEntity[];


    @OneToMany(() => ReviewEntity, e => e.product)
    reviews: ReviewEntity[];

}
