import { ApiProperty } from '@nestjs/swagger';
import AttributeTypes from '../../../attributes/types/attribute.types.enum.js';
import { ProductView } from '../../../products/views/product.view.js';

class AttributeValueDto {
    @ApiProperty({ description: 'Slug of an attribute', type: 'string' })
    public slug: string;
    @ApiProperty({ description: 'Title of an attribute', type: 'string' })
    public title: string;
    @ApiProperty({ description: 'Type of an attribute', enum: AttributeTypes })
    public type: string;
    @ApiProperty({
        description: 'Value of an attribute',
        oneOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'null' },
        ],
    })
    public value: string | boolean | number | null;

    constructor(
        slug: string,
        title: string,
        type: string,
        value: (string | number | boolean | null)
    ) {
        this.slug = slug;
        this.title = title;
        this.type = type;
        this.value = value;
    }
}



export class OutputProductDto {
    @ApiProperty({ description: 'Slug of a product', type: 'string' })
    slug: string;
    @ApiProperty({ description: 'Type of a product', type: 'string' })
    type: string;
    @ApiProperty({ description: 'Category of a product', type: 'string' })
    category: string;

    @ApiProperty({ description: 'Title of a product', type: 'string' })
    title: string;
    @ApiProperty({ description: 'Short description of a product', type: 'string' })
    shortDescription: string;
    @ApiProperty({ description: 'Description of a product', type: 'string' })
    description: string;

    @ApiProperty({ description: 'Price of a product', type: 'number' })
    price: number;
    @ApiProperty({ description: 'Average user rating of a product', type: 'number' })
    averageRating: number;
    @ApiProperty({ description: 'Total amount of reviews on a given product', type: 'number' })
    reviewCount: number;


    @ApiProperty({ description: 'Attributes of a product', type: [AttributeValueDto] })
    attributes: AttributeValueDto[];
    images: string[];


    constructor(product: ProductView) {
        this.slug = product.slug;
        this.title = product.title;
        this.shortDescription = product.shortDescription;
        this.description = product.description;
        this.price = product.price;
        this.type = product.productTypeSlug;
        this.category = product.categorySlug;
        this.averageRating = product.averageRating;
        this.reviewCount = product.reviewCount;

        if (product.attributeValues) {
            this.attributes = [];
            for (const attrVal of product.attributeValues)
                this.attributes.push(
                    new AttributeValueDto(
                        attrVal.slug,
                        attrVal.title,
                        attrVal.type,
                        attrVal.valueBool ?? attrVal.valueString ?? attrVal.valueInt ?? null
                    )
                );
        }

        if (product.images) {
            this.images = [];
            for (const img of product.images)
                this.images.push(img.url);
        }
    }
}