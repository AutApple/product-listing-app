import {  IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    slug: string;

    @IsString() 
    title: string; 

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    parentCategorySlug?: string;
}
