import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReviewVoteEntity } from './review-vote.entity.js';
import { ProductEntity } from '../../products/entities/product.entity.js';
import { ReviewImageEntity } from './review-image.entity.js';

@Entity()
export class ReviewEntity extends AbstractEntity {
    
    @ManyToOne(() => UserEntity, e => e.reviews)
    author: UserEntity;
    
    @ManyToOne(() => ProductEntity, e => e.reviews)
    product: ProductEntity;
    
    @OneToMany(() => ReviewVoteEntity, e => e.review)
    votes: ReviewVoteEntity[];

    @OneToMany(() => ReviewImageEntity, e => e.review)
    images: ReviewImageEntity[];
    
    rating: number; // from 1.0 to 5.0


}
