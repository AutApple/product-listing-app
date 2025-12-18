import { FieldType, QueryParserConfiguration } from '../query-parser/types/query-parser-config.type.js';

const products: QueryParserConfiguration = {
    fields: {
        'attributes': [
            { path: 'attributeValues.attributeId' },
            { path: 'attributeValues.productId' },
            { path: 'attributeValues.attribute.id' },
            { path: 'attributeValues.attribute.slug' },
            { path: 'attributeValues.attribute.title' },
            { path: 'attributeValues.attribute.type' },
            { path: 'attributeValues.valueString' },
            { path: 'attributeValues.valueBool' },
            { path: 'attributeValues.valueInt' }
        ],
        'images': [{ path: 'images.id', type: FieldType.STRING }, { path: 'images.url', type: FieldType.STRING }],
        'type': {
            type: FieldType.STRING,
            path: 'productType.slug'
        },
        'price': {
            type: FieldType.NUMBER,
            path: 'price'
        },
        'title': {
            type: FieldType.STRING,
            path: 'title'
        },
        'createdAt': {
            path: 'createdAt'
        },
        'updatedAt': {
            path: 'updatedAt'
        }
    },
    orderFields: ['createdAt', 'updatedAt'],
    filterFields: ['type', 'price'],
    includeFields: ['attributes', 'type', 'images'],
    enableFilterFallbackCollection: true,
    searchField: 'title'
};

const productTypes: QueryParserConfiguration = {
    fields: {},
    enableFilterFallbackCollection: false
};

const attributes: QueryParserConfiguration = {
    fields: {},
    enableFilterFallbackCollection: false

};

const categories: QueryParserConfiguration = {
    fields: {},
    enableFilterFallbackCollection: false
};

export const globalQueryParserConfig: Record<string, QueryParserConfiguration> = {
    products, productTypes, attributes, categories
};