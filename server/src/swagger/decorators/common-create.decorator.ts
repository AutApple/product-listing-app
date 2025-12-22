import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { capitalizeString } from '../utils/capitalizeString.js';

export function ApiCommonCreateResource<BDto, ODto>(
    resourceName: string,
    bodyDto: new (...args: any[]) => BDto,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true
) {
    return applyDecorators(
        ApiTags(`${capitalizeString(resourceName)} / Write`),
        ApiExtraModels(bodyDto, outputDto),
        ApiOperation({
            summary: `${adminOnly ? 'Admin-only: ' : ''}Create a new ${resourceName}`
        }),
        ApiBody({
            schema: {
                oneOf: [
                    { $ref: getSchemaPath(bodyDto) },
                    { type: 'array', items: { $ref: getSchemaPath(bodyDto) } }
                ]
            }
        }),
        ApiBearerAuth(),
        ApiCreatedResponse({
            schema: {
                oneOf: [
                    { $ref: getSchemaPath(outputDto), description: `Newly created ${resourceName} object` },
                    { type: 'array', items: { $ref: getSchemaPath(outputDto) }, description: `Newly created ${resourceName} objects` }
                ]
            }
        }),
        adminOnly? ApiForbiddenResponse({ description: 'Forbidden: Admins only route' }) : () => {}
    );
}