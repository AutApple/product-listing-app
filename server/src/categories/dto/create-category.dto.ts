import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {  IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        name: 'slug',
        description: 'Slug of a category'
    })
    @IsString()
    slug: string;

    @ApiProperty({
        name: 'title',
        description: 'Title of a category'
    })
    @IsString() 
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
