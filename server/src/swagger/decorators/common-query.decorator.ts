import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

export function ApiCommonQueryOneResource(resourceName: string) {
    return applyDecorators(
      ApiTags(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} / Read`),
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
    return applyDecorators( 
        ApiTags(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} / Read`),
        ApiQuery({ name: 'offset', type: Number, required: false, description: `How much ${resourceName}s to skip`, example: 0 }),
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
        }),
        ApiQuery({
            name: 'filter',
            type: String,
            required: false,
            description: 'Filters in the form filter[property]=value1,value2,...',
            example: { color: ['red','blue'], size: ['M'] },
        })
    );
}