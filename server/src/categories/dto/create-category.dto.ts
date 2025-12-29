import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {  IsNotEmpty, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';

export class CreateCategoryDto {
    @ApiProperty({
        name: 'slug',
        description: 'Slug of a category'
    })
    @IsString()
    @Length(defaultValidationConfig.category.minSlugLength, defaultValidationConfig.category.maxSlugLength)
    slug: string;

    @ApiProperty({
        name: 'title',
        description: 'Title of a category'
    })
    @IsString() 
    @Length(defaultValidationConfig.category.minTitleLength, defaultValidationConfig.category.maxTitleLength)
    title: string; 

    @ApiPropertyOptional({
        name: 'parentCategorySlug',
        description: 'Slug of a parent category'
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    parentCategorySlug?: string;
}
