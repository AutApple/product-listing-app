import AttributeTypes from '../../types/attribute.types.enum.js';
import { AttributeEntity } from '../../entities/attribute.entity.js';

export class OutputAttributeDTO {
    slug: string; 
    type: string; 
    title: string;
    constructor (attribute: AttributeEntity) {
        this.slug = attribute.slug;
        this.type = attribute.type;
        this.title = attribute.title;
        if(attribute.type === AttributeTypes.ENUM)
            Object.assign(this, {enumValues: attribute.enumValues.map(v => v.value)})
        
    }
}