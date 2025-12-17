import { UserEntity } from '../../users/entities/user.entity.js';
import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { ReviewEntity } from './review.entity.js';

export enum RatingType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

@Entity({
  name: 'review_votes'
})
@Unique(['review', 'user']) // one user can have only one vote per specific review
export class ReviewVoteEntity {
    @PrimaryColumn('uuid')
    id: string;
    
    @ManyToOne(() => ReviewEntity, e => e.votes)
    review: ReviewEntity;

    @ManyToOne(() => UserEntity, e => e.reviewVotes)
    user: UserEntity;
    
    @Column({
        type: 'enum',
        enum: RatingType,
        enumName: 'review_rating_type'
    })
    rating: RatingType; 
}