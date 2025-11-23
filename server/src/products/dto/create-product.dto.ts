import { IsString, Length } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';

export class CreateProductDto {
    @IsString()
    @Length(
        defaultValidationConfig.product.minProductSlugLength,
        defaultValidationConfig.product.maxProductSlugLength
    )
    slug: string;

    @IsString()
    @Length(
        defaultValidationConfig.product.minProductTitleLength,
        defaultValidationConfig.product.maxProductTitleLength
    )
    title: string;
}
