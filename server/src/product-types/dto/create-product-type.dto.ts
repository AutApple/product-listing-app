import { IsString, Length } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';

export class CreateProductTypeDto {
    @IsString()
    @Length(defaultValidationConfig.productType.minSlugLength, defaultValidationConfig.productType.maxSlugLength)
    slug: string;
}
