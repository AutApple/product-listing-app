export interface CommonConfig {
    apiTitle: string; 
    apiDescription: string;
    apiVersion: string; 
}


const defaultCommonConfig = { 
    apiTitle: 'Product Listing API',
    apiDescription: `Product Listing API`,
    apiVersion: '1.0'
}

export default defaultCommonConfig;