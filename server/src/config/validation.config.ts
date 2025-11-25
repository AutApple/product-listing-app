export interface ProductValidationConfig {
        maxTitleLength: number
        minTitleLength: number

        maxSlugLength: number
        minSlugLength: number

        maxShortDescriptionLength: number
        minShortDescriptionLength: number
        
        maxDescriptionLength: number
        minDescriptionLength: number
}

export interface ProductTypeValidationConfig {
    minSlugLength: number;
    maxSlugLength: number;
}

export interface ValidationConfig {
    product: ProductValidationConfig;
    productType: ProductTypeValidationConfig;
}


const defaultValidationConfig: ValidationConfig = {
    product: {
        maxTitleLength: 128,
        minTitleLength: 10,

        maxSlugLength: 20,
        minSlugLength: 5,
        
        maxShortDescriptionLength: 1500,
        minShortDescriptionLength: 3,

        maxDescriptionLength: 1500,
        minDescriptionLength: 3,
    },
    productType: {
        minSlugLength: 5,
        maxSlugLength: 20
    }
}

export default defaultValidationConfig; 