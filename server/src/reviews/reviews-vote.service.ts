import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewVoteEntity, VoteType, ReviewEntity } from './';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from '../config/';

@Injectable()
export class ReviewsVoteService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(ReviewVoteEntity) private readonly reviewVoteRepository: Repository<ReviewVoteEntity>,
        @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>
    ) { }

    async vote(vote: VoteType, id: string, email: string): Promise<ReviewVoteEntity> {
        let voteEntity = await this.reviewVoteRepository.findOne({where: {review: {id}, user: {email}}});
        if (voteEntity) {
            voteEntity.vote = vote;
            return await this.reviewVoteRepository.save(voteEntity);
        }
        
        const user = await this.usersService.findOneByEmail(email);
        
        const review = await this.reviewRepository.findOne({where: {id}, relations: ['author', 'product']});
        if (!review)
            throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('review', id, 'id'));
        
        voteEntity = this.reviewVoteRepository.create({user, review, vote})
        return await this.reviewVoteRepository.save(voteEntity);
    }

    async remove(id: string, email: string) {
        let voteEntity = await this.reviewVoteRepository.findOne({where: {review: {id}, user: {email}}});
        if (!voteEntity)
            throw new NotFoundException(ERROR_MESSAGES.RESOURCE_NOT_FOUND('vote', id, 'id'));
        await this.reviewVoteRepository.remove(voteEntity);
        return voteEntity;
    }
}