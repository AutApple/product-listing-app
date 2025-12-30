import { ViewColumn, ViewEntity } from 'typeorm';
import { ProductEntity } from '../entities/product.entity.js';


interface AttributeValueView {
    slug: string, 
    title: string, 
    type: string, 
    valueString: string | null; 
    valueBool: boolean | null;
    valueInt: number | null;
}

@ViewEntity({
    name: 'product_view',
    expression: `
        SELECT
            p.id,
            p.slug,
            p.title,
            p.short_description AS "shortDescription",
            p.description,
            p.price,
            p.created_at AS "createdAt",
            p.updated_at AS "updatedAt",

            pt.slug AS "productTypeSlug",
            c.slug AS "categorySlug",

            COALESCE(
                (
                    SELECT AVG(rating) FROM reviews
                    WHERE reviews."productId" = p.id
                ),
                0
            ) AS "averageRating",
            COALESCE(
                (
                    SELECT COUNT(id) FROM reviews
                    WHERE reviews."productId" = p.id
                ),
                0
            ) AS "reviewCount",
            
            COALESCE(
                (
                    SELECT json_agg(json_build_object(
                                                        'slug', a.slug,
                                                        'title', a.title,
                                                        'type', a.type,
                                                        'valueString', av."valueString",
                                                        'valueBool', av."valueBool",
                                                        'valueInt', av."valueInt"
                                                    ))
                    FROM product_attribute_values av
                    LEFT JOIN attributes a
                    ON a.id = av.attribute_id 
                    WHERE av.product_id = p.id
                ),
                '[]'::json
            ) AS "attributeValues",
                  COALESCE(
            (
                SELECT json_agg(json_build_object('url', pi.url))
                FROM product_images pi
                WHERE pi."productId" = p.id
                AND pi.url IS NOT NULL
            ),
            '[]'::json
            ) AS images
            FROM products p
            LEFT JOIN product_types pt ON pt.id = p."productTypeId"
            LEFT JOIN categories c ON c.id = p."categoryId" 
            GROUP BY 
                p.id,
                p.slug,
                p.created_at,
                p.updated_at,
                p.short_description,
                p.description,
                p.price,
                p.title,
                pt.slug,
                c.slug    
    `
})
export class ProductView {
    @ViewColumn()
    id: string;
    
    @ViewColumn()
    createdAt: Date;

    @ViewColumn()
    updatedAt: Date;

    @ViewColumn()
    slug: string;
    
    @ViewColumn()
    title: string;
    
    @ViewColumn()
    shortDescription: string;
    
    @ViewColumn()
    description: string; 
    
    @ViewColumn()
    price: number;
    
    @ViewColumn()
    averageRating: number;
    
    @ViewColumn()
    reviewCount: number;

    @ViewColumn()
    categorySlug: string; 

    @ViewColumn()
    productTypeSlug: string; 

    @ViewColumn()
    attributeValues: AttributeValueView[];

    @ViewColumn()
    images: Array<{ url: string }>; 

    public static generateFromEntity (entity: ProductEntity) {
        const pv = new ProductView();
        pv.attributeValues = [];
        pv.id = entity.id;
        pv.createdAt = entity.createdAt;
        pv.updatedAt = entity.updatedAt; 
        pv.shortDescription = entity.shortDescription;
        pv.title = entity.title;
        pv.description = entity.description;
        pv.price = entity.price; 
        pv.averageRating = 0;
        pv.reviewCount = 0;
        pv.images = entity.images; 
        pv.categorySlug = entity.category.slug;
        for (const av of entity.attributeValues)
            pv.attributeValues.push(
                {
                    slug: av.attribute.slug,
                    title: av.attribute.title,
                    type: av.attribute.type,
                    valueBool: av.valueBool,
                    valueInt: av.valueInt,
                    valueString: av.valueString
                }
            );
        return pv;
    }
}