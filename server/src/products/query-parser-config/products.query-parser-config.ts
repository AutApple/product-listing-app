import { QueryParserConfiguration } from '../../common/interfaces/query-parser-config.type.js';

export const productSelectAttributes = {
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
}

const productSelectImages = {
    images: {
        id: true,
        url: true
    }
}


export const productsQueryParserConfig: QueryParserConfiguration = {
    includeMap: {
        'attributes': productSelectAttributes,
        'images': productSelectImages 
    },
    orderOptions: ['createdAt', 'updatedAt']
};
