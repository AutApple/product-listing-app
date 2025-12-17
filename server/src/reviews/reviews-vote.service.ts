import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { UsersService } from '../users/users.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewVoteEntity, VoteType } from './entities/review-vote.entity.js';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

@Injectable()
export class ReviewsVoteService {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly usersService: UsersService,
        @InjectRepository(ReviewVoteEntity) private readonly reviewVoteRepository: Repository<ReviewVoteEntity>
    ) { }

    async vote(vote: VoteType, id: string, email: string) {
        let voteEntity = await this.reviewVoteRepository.findOne({where: {review: {id}, user: {email}}});
        if (voteEntity) {
            voteEntity.vote = vote;
            return await this.reviewVoteRepository.save(voteEntity);
        }
        
        const user = await this.usersService.findOneByEmail(email);
        const review = await this.reviewsService.findOneById(id);
        voteEntity = this.reviewVoteRepository.create({user, review, vote})
        await this.reviewVoteRepository.save(voteEntity);
        return true;
    }

    async remove(id: string, email: string) {
        let voteEntity = await this.reviewVoteRepository.findOne({where: {review: {id}, user: {email}}});
        if (!voteEntity)
            throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('vote', id, 'id'));
        await this.reviewVoteRepository.remove(voteEntity);
        return true;
    }

}