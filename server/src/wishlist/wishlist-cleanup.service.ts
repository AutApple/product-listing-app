import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { WishlistEntity } from './entities/wishlist.entity.js';

@Injectable()
export class WishlistCleanupService {
    private readonly logger = new Logger(WishlistCleanupService.name);
    constructor (
        @InjectRepository(WishlistEntity) private readonly wishlistRepository: Repository<WishlistEntity>
    ) {}
    @Cron('0 * * * *') // every hour
    async cleanupExpiredGuests() {
        const now = new Date();

        try {
            const result = await this.wishlistRepository.delete({
                user: IsNull(),
                expiresAt: LessThan(now),
            });

            if (result.affected && result.affected > 0) {
                this.logger.log(
                    `Removed ${result.affected} expired guest wishlists`,
                );
            }
        } catch (error) {
            this.logger.error(
                'Failed to cleanup expired guest wishlists',
                error.stack,
            );
        }
    }
}