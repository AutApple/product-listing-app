import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthWishlistService } from './auth-wishlist.service.js';
import { GuestWishlistService } from './guest-wishlist.service.js';
import { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';
import { WishlistEntity } from './entities/wishlist.entity.js';
import { ModifyWishlistDto } from './dto/modify-wishlist.dto.js';

@Injectable()
export class WishlistOrchestratorService {
    constructor(
        private readonly authWishlistService: AuthWishlistService,
        private readonly guestWishlistService: GuestWishlistService
    ) { }
    async get(session: Record<string, any> | undefined, user: JwtPayload | undefined): Promise<WishlistEntity> {
        if(!session)
            throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('No session object'));
        if(user && user?.email)
           return await this.authWishlistService.getOrCreateWishlist(user.email, session);
        // console.log('Doing guest wishlist get');
        return await this.guestWishlistService.getOrCreateWishlist(session);
    }
    async add(addToWishlistDto: ModifyWishlistDto, session: Record<string, any> | undefined, user: JwtPayload | undefined): Promise<WishlistEntity> {
        if(!session)
            throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('No session object'));
        console.log(user);
        if(user !== undefined && user?.email)
           return await this.authWishlistService.add(addToWishlistDto, user.email, session);
        // console.log('Doing guest wishlist add');
        return await this.guestWishlistService.add(addToWishlistDto, session);
    }
}