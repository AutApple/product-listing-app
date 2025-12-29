import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';

export class CreateReviewDto {
    @ApiProperty({
        name: 'productSlug',
        description: 'Slug of a product',
        type: 'string'
    })
    @IsString()
    productSlug: string;
    

    @ApiProperty({
        name: 'rating',
        description: 'Product rating of a review',
        type: 'number'
    })
    @IsNumber()
    @Max(5.0)
    @Min(1.0)
    rating: number;
 
    @ApiProperty({
        name: 'text',
        description: 'Text of a review',
        type: 'string'
    })
    @IsString()
    @Length(defaultValidationConfig.review.minTextLength, defaultValidationConfig.review.maxTextLength)
    text: string; 

    @ApiProperty({
        name: 'images',
        description: 'URLs of a review images',
        type: [String]
    })
    @IsArray()
    @IsString({each: true}) // FIXME: IsUrl in production
    images: string[];
}
