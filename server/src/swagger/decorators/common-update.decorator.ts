import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';

export function ApiCommonUpdateResource<BDto, ODto>(
    resourceName: string,
    bodyDto: new (...args: any[]) => BDto,
    outputDto: new (...args: any[]) => ODto,
    adminOnly: boolean = true
) {
    return applyDecorators(
        ApiTags(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} / Write`),
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