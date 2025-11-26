import { IsArray, IsEnum, IsNotEmpty, IsString, Length, ValidateIf } from 'class-validator';
import defaultValidationConfig from '../../config/validation.config.js';
import AttributeTypes from '../types/attribute.types.enum.js';


export class CreateAttributeDto {
    @IsString()
    @Length(defaultValidationConfig.attribute.minSlugLength, defaultValidationConfig.attribute.maxSlugLength)
    slug: string;

    @IsString()
    title: string;

    @IsEnum(AttributeTypes)
    type: AttributeTypes;

    @ValidateIf((o: CreateAttributeDto) => o.type === AttributeTypes.ENUM, {message: 'Provide enum values with enumValues field'})
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    enumValues?: string[];
}
