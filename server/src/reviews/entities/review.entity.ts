import { Check, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { ImageEntity } from '../../images/index.js';
import { ProductEntity } from '../../products/entities/product.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';
import { ReviewVoteEntity } from './review-vote.entity.js';

@Check(`"rating" >= 1.0 AND "rating" <= 5.0`)
@Entity({
    name: 'reviews'
})
export class ReviewEntity extends AbstractEntity {

    @ManyToOne(() => UserEntity, e => e.reviews)
    author: UserEntity;

    @ManyToOne(() => ProductEntity, e => e.reviews)
    product: ProductEntity;

    @OneToMany(() => ReviewVoteEntity, e => e.review, { nullable: true, cascade: true })
    votes: ReviewVoteEntity[];

    @OneToMany(() => ImageEntity, e => e.review, {
        cascade: ['update', 'remove']
    })
    images: ImageEntity[];

    @Column({
        type: 'decimal',
        precision: 2,
        scale: 1
    })
    rating: number; // from 1.0 to 5.0

    @Column({
        type: 'text'
    })
    text: string;

    reviewVoteScore?: number; // being explicitly set in review service

}
