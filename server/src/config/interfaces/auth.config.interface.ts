export interface AuthConfiguration {
    saltLevel: number;
    
    jwtAccessSecret: string;
    jwtRefreshSecret: string; 
    
    sessionSecret: string; 
    
    jwtAccessTokenExpiration: number;
    jwtRefreshTokenExpiration: number;

    anonymousWishlistsExpirationDays: number;
}