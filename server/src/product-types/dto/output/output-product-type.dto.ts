import { ApiProperty } from '@nestjs/swagger';
import { OutputAttributeDto } from '../../../attributes/dto/output/output-attribute.dto.js';
import { ProductTypeEntity } from '../../entities/product-type.entity.js';

export class OutputProductTypeDto { 
    @ApiProperty({
            type: 'string',
            name: 'slug',
            description: 'Slug of a product type'
    })
    slug: string; 
    
    @ApiProperty({
        type: [OutputAttributeDto],
        name: 'attributes',
        description: 'Full attribute objects that belong to a product type'
    })
    attributes: OutputAttributeDto[];

    constructor (productType: ProductTypeEntity) {
        this.slug = productType.slug;
        this.attributes = productType.attributes.map(v => new OutputAttributeDto(v));
    }
}