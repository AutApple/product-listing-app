import { IsArray, IsBoolean, IsInt, IsNumber, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';
import { Type } from 'class-transformer';
import { IsStringNumberBoolean } from '../../common/validators/is-string-number-boolean.validator.js';
import { isTypedArray } from 'util/types';


class AttributeItem {
  @IsString()
  key: string;

  @IsStringNumberBoolean()
  value: number | boolean | string
}

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

    @IsNumber()
    price: number;
    
    @IsArray()
    // @IsUrl({}, { each: true }) - will be for production, ill use string for now
    @IsString({ each: true })
    imageUrls: string[];

    @IsString()
    productTypeSlug: string;

    // Attribute values will be specified in there
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeItem)
    attributes: AttributeItem[];

}