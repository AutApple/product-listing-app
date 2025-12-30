import { IsArray, IsBoolean, IsInt, IsNumber, IsString, IsUrl, Length, ValidateNested } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';
import { Type } from 'class-transformer';
import { IsStringNumberBoolean } from '../../common/validators/is-string-number-boolean.validator.js';
import { isTypedArray } from 'util/types';
import { ApiProperty } from '@nestjs/swagger';


class AttributeItem {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({oneOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}]})
  @IsStringNumberBoolean()
  value: number | boolean | string
}

export class CreateProductDto {
    @ApiProperty({
        description: 'Slug of a product',
        required: true,
        // minLength: defaultValidationConfig.product.minSlugLength,
        // maxLength: defaultValidationConfig.product.maxSlugLength
    })
    @IsString()
    @Length(
        defaultValidationConfig.product.minSlugLength,
        defaultValidationConfig.product.maxSlugLength
    )
    slug: string;

    @ApiProperty({
        description: 'Title of a product',
        required: true,
        // minLength: defaultValidationConfig.product.minTitleLength,
        // maxLength: defaultValidationConfig.product.maxTitleLength
    })
    @IsString()
    @Length(
        defaultValidationConfig.product.minTitleLength,
        defaultValidationConfig.product.maxTitleLength
    )
    title: string;

    @ApiProperty({
        description: 'Short description of a product',
        required: true,
        // minLength: defaultValidationConfig.product.minShortDescriptionLength,
        // maxLength: defaultValidationConfig.product.maxShortDescriptionLength
    })
    @IsString()
    @Length(
        defaultValidationConfig.product.minShortDescriptionLength,
        defaultValidationConfig.product.maxShortDescriptionLength  
    )
    shortDescription: string;

    @ApiProperty({
        description: 'Description of a product',
        required: true,
        // minLength: defaultValidationConfig.product.minDescriptionLength,
        // maxLength: defaultValidationConfig.product.maxDescriptionLength
    })
    @IsString()
    @Length(
        defaultValidationConfig.product.minDescriptionLength,
        defaultValidationConfig.product.maxDescriptionLength
    )
    description: string;

    @ApiProperty({
        description: 'Price of a product',
        required: true,
        
    })
    @IsNumber()
    price: number;
    

    @ApiProperty({
        description: 'Array of strings resembling slugs of images uploaded via POST /images endpoint',
        required: true,
        type: [String]
    })
    @IsArray()
    @IsString({ each: true })
    imageSlugs: string[];

    @ApiProperty({
        description: 'Slug of a product type that the product is related to',
        required: true
    })
    @IsString()
    productTypeSlug: string;

    @ApiProperty({
        description: 'Slug of a category that the product is related to',
        required: true
    })
    @IsString()
    categorySlug: string;

    @ApiProperty({
        type: [AttributeItem],
        description: 'Array of attribute values',
        required: true
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeItem)
    attributes: AttributeItem[];

}