import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductTypeDto {
    @ApiProperty({
        type: 'string',
        name: 'slug',
        description: 'Slug of a product type'
    })
    @IsString()
    @Length(defaultValidationConfig.productType.minSlugLength, defaultValidationConfig.productType.maxSlugLength)
    slug: string;

    @ApiProperty({
        type: [String],
        name: 'attributes',
        description: 'Slugs of an individual attributes that belong to the specified product type'
    })
    @IsArray()
    @IsString({each: true})
    @ArrayNotEmpty()
    attributes: string[];
}
