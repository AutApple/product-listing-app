import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/index.js';
import { UserEntity } from '../../users/index.js';
import { Exclude } from 'class-transformer';
import { ProductEntity } from '../../products/index.js';
import { ReviewEntity } from '../../reviews/index.js';

@Entity({
    name: 'images'
})
export class ImageEntity extends AbstractEntity {
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
    filename: string;

    @ManyToOne(() => UserEntity, e => e.images)
    author: UserEntity;

    @ManyToOne(() => ProductEntity,
        (product: ProductEntity) => product.images,
        { nullable: true }
    )
    @Exclude({ toPlainOnly: true })
    product: ProductEntity;

    @ManyToOne(() => ReviewEntity,
        (review: ReviewEntity) => review.images,
        { nullable: true }
    )
    @Exclude({ toPlainOnly: true })
    review: ReviewEntity;

    // TODO: replace entity-specific images (like ProductImage) with common ImageEntity and define corresponding relations 

}
