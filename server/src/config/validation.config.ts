export interface ProductValidationConfig {
        maxProductTitleLength: number
        minProductTitleLength: number

        maxProductSlugLength: number
        minProductSlugLength: number
}

export interface ValidationConfig {
    product: ProductValidationConfig
}


const defaultValidationConfig: ValidationConfig = {
    product: {
        maxProductTitleLength: 128,
        minProductTitleLength: 10,

        maxProductSlugLength: 20,
        minProductSlugLength: 5
    }
}

export default defaultValidationConfig; 