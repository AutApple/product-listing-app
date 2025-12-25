import { IsArray, IsEnum, IsNotEmpty, IsString, Length, ValidateIf } from 'class-validator';
import { defaultValidationConfig } from '../../config/validation.config.js';
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
    slug: string;

    @ApiProperty({
        type: 'string',
        name: 'title',
        description: 'Display title of an attribute'
    })
    @IsString()
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
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    enumValues?: string[];
}
