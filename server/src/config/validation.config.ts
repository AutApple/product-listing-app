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
    minSlugLength: 5,
    maxSlugLength: 20
}

const globalTitleLength = {
    minTitleLength: 10,
    maxTitleLength: 128
}

const defaultValidationConfig: ValidationConfig = {
    product: {
        ...globalTitleLength,
        ...globalSlugLength,

        maxShortDescriptionLength: 1500,
        minShortDescriptionLength: 3,

        maxDescriptionLength: 1500,
        minDescriptionLength: 3,
    },
    productType: {
        ...globalSlugLength
    },
    attribute: {
        ...globalSlugLength,
        ...globalTitleLength
    }
}

export default defaultValidationConfig; 