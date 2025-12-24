import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { capitalizeString } from '../utils/capitalizeString.js';

export function ApiCommonCreateResource<BDto, ODto>(
    resourceName: string,
    bodyDto: new (...args: any[]) => BDto,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true,
    canConflict: boolean = true
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
        ApiBadRequestResponse({description: `Bad Request: ${capitalizeString(resourceName)} missing required fields`}),
        adminOnly? ApiForbiddenResponse({ description: 'Forbidden: Admin-only route' }) : () => {},
        canConflict? ApiConflictResponse({ description: `Conflict: ${capitalizeString(resourceName)} with specified slug already exists` }) : () => {}
    );
}