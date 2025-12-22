import { ApiProperty } from '@nestjs/swagger';

export class OutputAuthDto {
    @ApiProperty({
        name: 'accessToken',
        description: 'Access token to use in order to access protected endpoints',
        type: 'string'
    })
    public readonly accessToken: string;
    
    @ApiProperty({
        name: 'refreshToken',
        description: 'Refresh token to use on /auth/refresh endpoint to get a new access/refresh token pair',
        type: 'string'
    })
    public readonly refreshToken: string;

    constructor(accessToken: string, refreshToken: string) { this.accessToken = accessToken; this.refreshToken = refreshToken; }
}