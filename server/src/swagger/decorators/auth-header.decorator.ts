import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiAuthHeader(refreshToken: boolean = false) {
    return applyDecorators(
        ApiHeader({
            name: 'Authorization',
            description: `Authorization header with \"Bearer [${refreshToken ? 'RefreshToken' : 'AccessToken'}]\" attached`,
            required: true
        })
    )
}