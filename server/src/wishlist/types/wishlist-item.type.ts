import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class WishlistItem {
    @IsString()
    slug: string;
    
    @IsNumber()
    @IsInt()
    @Type(() => Number)
    amount: number;
}