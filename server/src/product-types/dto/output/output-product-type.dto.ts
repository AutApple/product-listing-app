import { ApiProperty } from '@nestjs/swagger';
import { OutputAttributeDTO } from '../../../attributes/dto/output/output-attribute.dto.js';
import { ProductTypeEntity } from '../../entities/product-type.entity.js';

export class OutputProductTypeDTO { 
    @ApiProperty({
            type: 'string',
            name: 'slug',
            description: 'Slug of a product type'
    })
    slug: string; 
    
    @ApiProperty({
        type: [OutputAttributeDTO],
        name: 'attributes',
        description: 'Full attribute objects that belong to a product type'
    })
    attributes: OutputAttributeDTO[];

    constructor (productType: ProductTypeEntity) {
        this.slug = productType.slug;
        this.attributes = productType.attributes.map(v => new OutputAttributeDTO(v));
    }
}