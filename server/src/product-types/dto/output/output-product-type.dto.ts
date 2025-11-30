import { OutputAttributeDTO } from '../../../attributes/dto/output/output-attribute.dto.js';
import { ProductTypeEntity } from '../../entities/product-type.entity.js';

export class OutputProductTypeDTO { 
    slug: string; 
    attributes: OutputAttributeDTO[];

    constructor (productType: ProductTypeEntity) {
        this.slug = productType.slug;
        this.attributes = productType.attributes.map(v => new OutputAttributeDTO(v));
    }
}