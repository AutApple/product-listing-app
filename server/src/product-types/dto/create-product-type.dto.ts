import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';

export class CreateProductTypeDto {
    @IsString()
    @Length(defaultValidationConfig.productType.minSlugLength, defaultValidationConfig.productType.maxSlugLength)
    slug: string;

    @IsArray()
    @IsString({each: true})
    @ArrayNotEmpty()
    attributes: string[];
}
