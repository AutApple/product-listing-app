import { AuthConfiguration } from './interfaces/auth.config.interface.js';

export const globalAuthConfiguration: AuthConfiguration = {
    saltLevel: 10,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'fallbackAccessSecretCode',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'fallbackRefreshSecretCode',
    jwtAccessTokenExpiration: 60 * 15,
    jwtRefreshTokenExpiration: 60 * 60 * 24 * 10,
    
    sessionSecret: process.env.SESSION_SECRET ?? 'fallbackSessionSecret',
    anonymousWishlistsExpirationDays: 2
}