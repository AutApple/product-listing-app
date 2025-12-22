import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { capitalizeString } from '../utils/capitalizeString.js';

export function ApiCommonUpdateResource<BDto, ODto>(
    resourceName: string,
    bodyDto: new (...args: any[]) => BDto,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true
) {
    return applyDecorators(
        ApiTags(`${capitalizeString(resourceName)} / Write`),
        ApiExtraModels(bodyDto, outputDto),
        ApiOperation({
            summary: `${adminOnly ? 'Admin-only: ' : ''}Update ${resourceName}`
        }),
        ApiBody({
            schema: { $ref: getSchemaPath(bodyDto) },
        }),
        ApiBearerAuth(),
        ApiCreatedResponse({
            schema: { $ref: getSchemaPath(outputDto), description: `Updated ${resourceName} object`, }
        }),
        adminOnly? ApiForbiddenResponse({ description: 'Forbidden: Admins only route' }) : () => {}
    );
}