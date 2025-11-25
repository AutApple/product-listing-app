import { IsArray, IsString, IsUrl, Length } from 'class-validator';
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

    @IsArray()
    // @IsUrl({}, { each: true }) - will be for production, ill use string for now
    @IsString({ each: true })
    imageUrls: string[];

    @IsString()
    productTypeSlug: string;
}
