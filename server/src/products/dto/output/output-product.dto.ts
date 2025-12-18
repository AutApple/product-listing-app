import { ProductEntity } from '../../../products/entities/product.entity.js';


class AttributeValueDTO {
    constructor (
        public slug: string, 
        public title: string, 
        public type: string, 
        public value: (string | number | boolean | null)
    ) {}
}



export class OutputProductDTO {
    slug: string;
    title: string; 
    shortDescription: string;
    description: string; 
    type: string;
    category: string;

    price: number;

    attributes: AttributeValueDTO[];
    images: string[];


    constructor(product: ProductEntity){
        this.slug = product.slug; 
        this.title = product.title;
        this.shortDescription = product.shortDescription;
        this.description = product.description;
        this.price = product.price;
        this.type = product.productType.slug; 
        this.category = product.category.slug; 

        if(product.attributeValues) {
            this.attributes = [];
            for (const attrVal of product.attributeValues)
                this.attributes.push(
                    new AttributeValueDTO(
                        attrVal.attribute.slug, 
                        attrVal.attribute.title, 
                        attrVal.attribute.type, 
                        attrVal.valueBool ?? attrVal.valueString ?? attrVal.valueInt ?? null
                    )
                );
        }

        if(product.images) {
            this.images = [];
            for (const img of product.images)
                this.images.push(img.url)
        }
    }
}