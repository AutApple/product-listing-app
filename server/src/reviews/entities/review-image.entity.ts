import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewEntity } from './review.entity.js';

@Entity()
export class ReviewImageEntity extends AbstractEntity {
    @ManyToOne(() => ReviewEntity, e => e.images)
    review: ReviewEntity;

    @Column({
        type: 'varchar'
    })
    url: string; 
}