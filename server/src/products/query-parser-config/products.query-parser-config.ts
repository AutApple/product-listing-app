import { QueryParserConfiguration } from '../../common/interfaces/query-parser-config.type.js';

const attributeDataSelect = {
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

const imageDataSelect = {
    images: true
}


export const productsQueryParserConfig: QueryParserConfiguration = {
    includeMap: {
        'attributes': attributeDataSelect,
        'images': imageDataSelect 
    },
    orderOptions: ['createdAt', 'updatedAt']
};
