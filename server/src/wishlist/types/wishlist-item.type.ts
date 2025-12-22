import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class WishlistItem {
    @ApiProperty({
        name: 'slug',
        description: 'Slug of a product'
    })
    @IsString()
    slug: string;
    
    @ApiProperty({
        name: 'amount',
        description: 'Amount of a products with given slug'
    })
    @IsNumber()
    @IsInt()
    @Type(() => Number)
    amount: number;
}