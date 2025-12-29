import { IsStrongPasswordOptions } from 'class-validator';
// TODO: config types into separate files 

interface SlugLengthConfig {
    minSlugLength: number;
    maxSlugLength: number;
}

interface TitleLengthConfig {
    minTitleLength: number;
    maxTitleLength: number;
}

interface ProductValidationConfig extends SlugLengthConfig, TitleLengthConfig {
    maxShortDescriptionLength: number;
    minShortDescriptionLength: number;

    maxDescriptionLength: number;
    minDescriptionLength: number;

    maxCategoryTitleLength: number;
    minCategoryTitleLength: number;

    maxCategorySlugLength: number;
    minCategorySlugLength: number;
}

interface ProductTypeValidationConfig extends SlugLengthConfig {
}

interface AttributeValidationConfig extends SlugLengthConfig, TitleLengthConfig {
    minEnumValueLength: number;
    maxEnumValueLength: number;
}

interface ReviewValidationConfig {
    minTextLength: number;
    maxTextLength: number;
}

interface AuthValidationConfig {
    minEmailLength: number;
    maxEmailLength: number;
    minNameLength: number;
    maxNameLength: number; 
    isStrongPasswordOptions: IsStrongPasswordOptions
}

interface CategoryValidationConfig extends SlugLengthConfig, TitleLengthConfig { }

export interface ValidationConfig {
    product: ProductValidationConfig;
    productType: ProductTypeValidationConfig;
    attribute: AttributeValidationConfig;
    review: ReviewValidationConfig;
    auth: AuthValidationConfig;
    category: CategoryValidationConfig;
}

export const defaultValidationConfig: ValidationConfig = {
    product: {
        minTitleLength: 5,
        maxTitleLength: 50,
        minSlugLength: 4,
        maxSlugLength: 50,

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
        minSlugLength: 4,
        maxSlugLength: 50
    },
    attribute: {
        minSlugLength: 4,
        maxSlugLength: 50,
        minTitleLength: 4,
        maxTitleLength: 50,
        minEnumValueLength: 1,
        maxEnumValueLength: 50
    },
    review: {
        minTextLength: 10,
        maxTextLength: 500
    },
    category: {
        minSlugLength: 4,
        maxSlugLength: 50,
        minTitleLength: 4,
        maxTitleLength: 50,
    },
    auth: {
        maxEmailLength: 50,
        minEmailLength: 5,
        maxNameLength: 40,
        minNameLength: 4,
        isStrongPasswordOptions: {
            minLength: 8, 
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        }
    }
};

export const attributeReservedSlugs: string[] = [
    'title',
    'type',
    'attribute',
    'description',
    'slug',
    'price',
    'created_at',
    'updated_at',
    'rating',
    'productRating'
];