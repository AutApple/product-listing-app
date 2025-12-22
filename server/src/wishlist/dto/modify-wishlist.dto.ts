import { IsArray, ValidateNested } from 'class-validator';
import { WishlistItem } from '../types/wishlist-item.type.js';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyWishlistDto {
    @ApiProperty({
        name: 'products',
        description: 'Wishlist items to peform operation on',
        type: [WishlistItem]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WishlistItem)
    products: WishlistItem[]; 
}
