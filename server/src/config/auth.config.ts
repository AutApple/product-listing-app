// Secret codes are specified in environment variables
import dotenv from 'dotenv';
dotenv.config(); // configure env variables

interface AuthConfiguration {
    saltLevel: number;
    
    jwtAccessSecret: string;
    jwtRefreshSecret: string; 
    
    sessionSecret: string; 
    
    jwtAccessTokenExpiration: number;
    jwtRefreshTokenExpiration: number;

    anonymousWishlistsExpirationDays: number;
}

export const globalAuthConfiguration: AuthConfiguration = {
    saltLevel: 10,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'fallbackAccessSecretCode',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'fallbackRefreshSecretCode',
    jwtAccessTokenExpiration: 60 * 15,
    jwtRefreshTokenExpiration: 60 * 60 * 24 * 10,
    
    sessionSecret: process.env.SESSION_SECRET ?? 'fallbackSessionSecret',
    anonymousWishlistsExpirationDays: 2
}