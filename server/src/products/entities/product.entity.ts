import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity.js';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ImageEntity } from '../../images/index.js';
import { ProductTypeEntity } from '../../product-types/entities/product-type.entity.js';
import { ReviewEntity } from '../../reviews/entities/review.entity.js';
import { WishlistItemEntity } from '../../wishlist/entities/wishlist-item.entity.js';
import { ProductAttributeValueEntity } from './product-attribute-value.entity.js';

@Entity({
    name: 'products'
})
export class ProductEntity extends AbstractEntity {
    @Column({
        type: 'varchar',
        length: 255
    })
    @Index({ unique: true })
    slug: string;

    @Column({
        type: 'varchar',
        length: 255
    })
    title: string;

    @Column({
        name: 'short_description',
        default: 'No description specified.',
        type: 'text'
    })
    shortDescription: string;

    @Column({
        default: 'No description specified.',
        type: 'text'
    })
    description: string;

    @Column({
        default: 0,
        type: 'numeric'
    })
    price: number;

    @ManyToOne(() => CategoryEntity)
    category: CategoryEntity;

    @OneToMany(() => ImageEntity, (image: ImageEntity) => image.product, {
        cascade: ['update', 'remove']
    })
    images: ImageEntity[];

    @ManyToOne(() => ProductTypeEntity, (productType: ProductTypeEntity) => productType.products)
    productType: ProductTypeEntity;

    @OneToMany(() => WishlistItemEntity, w => w.product)
    wishlistItems: WishlistItemEntity[];

    @OneToMany(
        () => ProductAttributeValueEntity,
        (productAttributeValue: ProductAttributeValueEntity) => productAttributeValue.product,
        { cascade: ['insert', 'update', 'remove'] }
    )
    attributeValues: ProductAttributeValueEntity[];

    @OneToMany(() => ReviewEntity, e => e.product, { cascade: ['insert', 'update', 'remove'] })
    reviews: ReviewEntity[];
}
