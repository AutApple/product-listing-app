import { AbstractEntity } from '../../common/entities/abstract.entity.js';
import { Entity } from 'typeorm';
import { ReviewEntity } from './review.entity.js';

@Entity()
export class ReviewImageEntity extends AbstractEntity {
    review: ReviewEntity;
    url: string; 
}