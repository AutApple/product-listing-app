import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class WishlistItem {
    @IsString()
    slug: string;
    
    @IsNumber()
    @Type(() => Number)
    amount: number;
}