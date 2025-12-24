import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiExtraModels, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { capitalizeString } from '../utils/capitalizeString.js';

export function ApiCommonDeleteResource<ODto>(
    resourceName: string,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true,
) {
    return applyDecorators(
        ApiTags(`${capitalizeString(resourceName)} / Write`),
        ApiExtraModels(outputDto),
        ApiOperation({
            summary: `${adminOnly ? 'Admin-only: ' : ''}Remove a ${resourceName} by slug`
        }),
        ApiParam({ name: 'slug', description: `Slug of ${resourceName} to remove`, type: 'string' }),
        ApiBearerAuth(),
        ApiOkResponse({
           schema: {description: 'Removed object', $ref: getSchemaPath(outputDto)}
        }),
        ApiBadRequestResponse({description: 'Bad Request: Can\'t remove resource because some other resources are referencing it'}),
        adminOnly? ApiForbiddenResponse({ description: 'Forbidden: Admins only route' }) : () => {},
        ApiNotFoundResponse({description: `No ${resourceName} with specified slug found`})
    );
}