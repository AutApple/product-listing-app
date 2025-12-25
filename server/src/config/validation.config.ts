interface SlugLengthConfig {
  minSlugLength: number;
  maxSlugLength: number;
}

interface TitleLengthConfig {
  minTitleLength: number;
  maxTitleLength: number;
}


export interface ProductValidationConfig extends SlugLengthConfig, TitleLengthConfig {
    maxShortDescriptionLength: number
    minShortDescriptionLength: number
        
    maxDescriptionLength: number
    minDescriptionLength: number

    maxCategoryTitleLength: number
    minCategoryTitleLength: number 

    maxCategorySlugLength: number
    minCategorySlugLength: number
}

export interface ProductTypeValidationConfig extends SlugLengthConfig {
}

export interface AttributeValidationConfig extends SlugLengthConfig, TitleLengthConfig {
}

export interface ValidationConfig {
    product: ProductValidationConfig;
    productType: ProductTypeValidationConfig;
    attribute: AttributeValidationConfig;
}

const globalSlugLength = {
    minSlugLength: 4,
    maxSlugLength: 100
}

const globalTitleLength = {
    minTitleLength: 10,
    maxTitleLength: 1000
}



export const defaultValidationConfig: ValidationConfig = {
    product: {
        ...globalTitleLength,
        ...globalSlugLength,

        maxShortDescriptionLength: 1500,
        minShortDescriptionLength: 3,

        maxDescriptionLength: 1500,
        minDescriptionLength: 3,

        maxCategoryTitleLength: 100,
        minCategoryTitleLength: 50,

        maxCategorySlugLength: 100,
        minCategorySlugLength: 50
    },
    productType: {
        ...globalSlugLength
    },
    attribute: {
        ...globalSlugLength,
        ...globalTitleLength
    }
}