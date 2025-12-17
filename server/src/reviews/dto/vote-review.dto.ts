import { IsEnum } from 'class-validator';
import { VoteType } from '../entities/review-vote.entity.js';

export class VoteReviewDto {
    @IsEnum(VoteType)
    vote: VoteType;
}