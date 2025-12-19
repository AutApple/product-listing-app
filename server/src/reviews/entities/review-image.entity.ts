import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewEntity } from './review.entity.js';

@Entity({
    name: 'review_images'
})
export class ReviewImageEntity extends AbstractEntity {
    @ManyToOne(() => ReviewEntity, e => e.images, {cascade: ['update']})
    review: ReviewEntity;

    @Column({
        type: 'varchar'
    })
    url: string; 
}