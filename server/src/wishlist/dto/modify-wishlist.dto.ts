import { IsArray, ValidateNested } from 'class-validator';
import { WishlistItem } from '../types/wishlist-item.type.js';
import { Type } from 'class-transformer';

export class ModifyWishlistDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WishlistItem)
    products: WishlistItem[]; 
}
