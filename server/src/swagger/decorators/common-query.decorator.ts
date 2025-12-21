import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiCommonQueryOneResource(resourceName: string) {
    return applyDecorators(
      ApiQuery({
        name: 'include',
        required: false,
        isArray: true,
        type: 'string',
        style: 'form',
        explode: false,
        description: 'Comma-separated list of relations to include',
        example: ['attributes', 'images'],
      }));
}

export function ApiCommonQueryManyResources(resourceName: string) {
    return applyDecorators( ApiQuery({ name: 'offset', type: Number, required: false, description: `How much ${resourceName}s to skip`, example: 10 }),
      ApiQuery({ name: 'limit', type: Number, required: false, description: `How much ${resourceName}s to take`, example: 10 }),
      ApiQuery({ name: 'search', type: String, required: false, description: 'Search term' }),
      ApiQuery({
        name: 'include',
        required: false,
        isArray: true,
        type: 'string',
        style: 'form',
        explode: false,
        description: 'Comma-separated list of relations to include',
        example: ['attributes', 'images'],
      }));
}