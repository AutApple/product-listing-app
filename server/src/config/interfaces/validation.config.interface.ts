import { IsStrongPasswordOptions } from 'class-validator';

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
