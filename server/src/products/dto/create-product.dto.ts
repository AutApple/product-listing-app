import { IsString, Length } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';

export class CreateProductDto {
    @IsString()
    @Length(
        defaultValidationConfig.product.minSlugLength,
        defaultValidationConfig.product.maxSlugLength
    )
    slug: string;

    @IsString()
    @Length(
        defaultValidationConfig.product.minTitleLength,
        defaultValidationConfig.product.maxTitleLength
    )
    title: string;

    @IsString()
    @Length(
        defaultValidationConfig.product.minShortDescriptionLength,
        defaultValidationConfig.product.maxShortDescriptionLength
    )
    shortDescription: string;

    @IsString()
    @Length(
        defaultValidationConfig.product.minDescriptionLength,
        defaultValidationConfig.product.maxDescriptionLength
    )
    description: string;

}
