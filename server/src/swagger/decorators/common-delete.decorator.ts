import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';

export function ApiCommonDeleteResource<ODto>(
    resourceName: string,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true,
) {
    return applyDecorators(
        ApiTags(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}s / Write`),
        ApiExtraModels(outputDto),
        ApiOperation({
            summary: `${adminOnly ? 'Admin-only: ' : ''}Remove a ${resourceName} by slug`
        }),
        ApiParam({ name: 'slug', description: `Slug of ${resourceName} to remove`, type: 'string' }),
        ApiBearerAuth(),
        ApiOkResponse({
           schema: {description: 'Removed object', $ref: getSchemaPath(outputDto)}
        }),
        adminOnly? ApiForbiddenResponse({ description: 'Forbidden: Admins only route' }) : () => {},
        ApiNotFoundResponse({description: `No ${resourceName} with specified slug found`})
    );
}