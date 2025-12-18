import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';
import { Check, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReviewVoteEntity } from './review-vote.entity.js';
import { ProductEntity } from '../../products/entities/product.entity.js';
import { ReviewImageEntity } from './review-image.entity.js';

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

    @OneToMany(() => ReviewImageEntity, e => e.review, {
        cascade: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    images: ReviewImageEntity[];
    
    @Column({
        type: 'decimal',
        precision: 2,
        scale: 1
    })
    rating: number; // from 1.0 to 5.0

    @Column({
        type: 'varchar'
    })
    text: string; 

    reviewVoteScore?: number; // being explicitly set in review service

}
