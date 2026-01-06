import { FieldType, QueryParserConfiguration } from './interfaces/query-parser-config.interface.js';

const products: QueryParserConfiguration = {
    fields: {
        'attributes': [
            { path: 'attributeValues.slug' },
            { path: 'attributeValues.title' },
            { path: 'attributeValues.type' },
            { path: 'attributeValues.valueString' },
            { path: 'attributeValues.valueBool' },
            { path: 'attributeValues.valueInt' }
        ],
        'images': [{ path: 'images.url', type: FieldType.STRING }],
        'type': {
            type: FieldType.STRING,
            path: 'productTypeSlug'
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
        },
        'averageRating': {
            path: 'averageRating',
            type: FieldType.NUMBER
        }
    },
    orderFields: ['createdAt', 'updatedAt', 'averageRating'],
    filterFields: ['type', 'price', 'averageRating'],
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

const reviews: QueryParserConfiguration = {
    fields: {
        'createdAt': {
            path: 'createdAt'
        },
        'updatedAt': {
            path: 'updatedAt'
        },
        'rating': {
            path: 'rating',
            type: FieldType.NUMBER,
        },
        'voteScore': {
            path: 'reviewVoteScore',
            type: FieldType.NUMBER,
        },
        'product': {
            path: 'productSlug',
            type: FieldType.STRING,
        }

    },
    orderFields: ['createdAt', 'updatedAt', 'rating', 'voteScore'],
    filterFields: ['createdAt', 'updatedAt', 'rating', 'product', 'voteScore'],
    includeFields: [],
    enableFilterFallbackCollection: true,
    searchField: 'title'
};


export const globalQueryParserConfig: Record<string, QueryParserConfiguration> = {
    products, productTypes, attributes, categories, reviews
};