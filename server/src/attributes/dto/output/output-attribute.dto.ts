import AttributeTypes from '../../types/attribute.types.enum.js';
import { AttributeEntity } from '../../entities/attribute.entity.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OutputAttributeDTO {
     @ApiProperty({
            type: 'string',
            name: 'slug',
            description: 'Slug of an attribute'
    })
    slug: string; 
    
    @ApiProperty({
        type: 'string',
        name: 'title',
        description: 'Display title of an attribute'
    })
    type: string; 
    
    @ApiProperty({
        enum: AttributeTypes,
        name: 'type',
        description: 'Type of value that attribute can have'
    })
    title: string;
    
    @ApiPropertyOptional({
        type: [String],
        name: 'enumValues',
        description: 'Array of enum values for enum attribute type'
    })
    enumValues?: string[];
    constructor (attribute: AttributeEntity) {
        this.slug = attribute.slug;
        this.type = attribute.type;
        this.title = attribute.title;
        if(attribute.type === AttributeTypes.ENUM)
            Object.assign(this, {enumValues: attribute.enumValues.map(v => v.value)})
        
    }
}