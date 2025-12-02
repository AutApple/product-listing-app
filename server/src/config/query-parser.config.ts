import { QueryParserConfiguration } from '../common/interfaces/query-parser-config.type.js';

// which stuff corresponds to which selections 
const productSelects = {
    attributes: {
        attributeValues: {
        productId: true,
        attributeId: true,
        product: false,
        attribute: {
            id: true,
            updatedAt: false,
            createdAt: false,
            slug: true,
            type: true,
            title: true
        },
        valueString: true,
        valueBool: true,
        valueInt: true
        }
    },
    type: {
        productType: {
            slug: true,
            attributes: {
                id: true,
                slug: true,
                type: true,
                enumValues: {
                    id: true,
                    attribute: true,
                    value: true
                }
            }
        }
    },
    images: {
        images: {    
            id: true,
            url: true
        }
    }
}


const products: QueryParserConfiguration = {
    includeMap: {
        'attributes': productSelects.attributes,
        'images': productSelects.images,
        'productType': productSelects.type
    },
    orderOptions: ['createdAt', 'updatedAt']
};
const productTypes: QueryParserConfiguration = {
    includeMap: {},
    orderOptions: []
}

const attributes: QueryParserConfiguration = {
    includeMap: {},
    orderOptions: []
}



export const globalQueryParserConfig: Record<string, QueryParserConfiguration> = {
    products
}