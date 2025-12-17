import { UserEntity } from '../../users/entities/user.entity.js';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ReviewEntity } from './review.entity.js';

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

@Entity({
  name: 'review_votes'
})
@Unique(['review', 'user']) // one user can have only one vote per specific review
export class ReviewVoteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => ReviewEntity, e => e.votes, {cascade: ['insert', 'update']})
    review: ReviewEntity;

    @ManyToOne(() => UserEntity, e => e.reviewVotes)
    user: UserEntity;
    
    @Column({
        type: 'enum',
        enum: VoteType,
        enumName: 'review_rating_type'
    })
    vote: VoteType; 
}