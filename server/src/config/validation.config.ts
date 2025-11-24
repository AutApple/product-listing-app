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

export interface ValidationConfig {
    product: ProductValidationConfig
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

    }
}

export default defaultValidationConfig; 