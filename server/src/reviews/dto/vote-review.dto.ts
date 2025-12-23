import { IsEnum } from 'class-validator';
import { VoteType } from '../entities/review-vote.entity.js';
import { ApiProperty } from '@nestjs/swagger';

export class VoteReviewDto {
    @ApiProperty({
        name: 'vote',
        enum: VoteType,
        description: 'Review vote value (upvote or downvote)'
    })
    @IsEnum(VoteType)
    vote: VoteType;
}