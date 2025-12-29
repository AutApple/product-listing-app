import { IsArray, IsEnum, IsNotEmpty, IsNotIn, IsString, Length, ValidateIf } from 'class-validator';
import { defaultValidationConfig, attributeReservedSlugs } from '../../config/validation.config.js';
import { AttributeTypes } from '../types/attribute.types.enum.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateAttributeDto {
    @ApiProperty({
        type: 'string',
        name: 'slug',
        description: 'Slug of an attribute'
    })
    @IsString()
    @Length(defaultValidationConfig.attribute.minSlugLength, defaultValidationConfig.attribute.maxSlugLength)
    @IsNotIn(attributeReservedSlugs)
    slug: string;

    @ApiProperty({
        type: 'string',
        name: 'title',
        description: 'Display title of an attribute'
    })
    @IsString()
    @Length(defaultValidationConfig.attribute.minTitleLength, defaultValidationConfig.attribute.maxTitleLength)
    title: string;

    @ApiProperty({
        enum: AttributeTypes,
        name: 'type',
        description: 'Type of value that attribute can have'
    })
    @IsEnum(AttributeTypes)
    type: AttributeTypes;

    @ApiPropertyOptional({
        type: [String],
        name: 'enumValues',
        description: 'Array of enum values for enum attribute type'
    })
    @ValidateIf((o: CreateAttributeDto) => o.type === AttributeTypes.ENUM, {message: 'Provide enum values with enumValues field'})
    @IsArray()
    @Length(defaultValidationConfig.attribute.minEnumValueLength, defaultValidationConfig.attribute.maxEnumValueLength, { each: true })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    enumValues?: string[];
}
