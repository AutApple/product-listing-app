import { ProductView } from 'src/products/views/product.view.js';

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
    type: string;
    category: string;


    title: string; 
    shortDescription: string;
    description: string; 
    
    price: number;
    averageRating: number;
    reviewCount: number;


    attributes: AttributeValueDTO[];
    images: string[];


    constructor(product: ProductView){
        this.slug = product.slug; 
        this.title = product.title;
        this.shortDescription = product.shortDescription;
        this.description = product.description;
        this.price = product.price;
        this.type = product.productTypeSlug; 
        this.category = product.categorySlug; 
        this.averageRating = product.averageRating;
        this.reviewCount = product.reviewCount;
        
        if(product.attributeValues) {
            this.attributes = [];
            for (const attrVal of product.attributeValues)
                this.attributes.push(
                    new AttributeValueDTO(
                        attrVal.slug, 
                        attrVal.title, 
                        attrVal.type, 
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