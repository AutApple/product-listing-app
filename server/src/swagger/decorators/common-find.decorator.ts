import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiCommonQueryManyResources, ApiCommonQueryOneResource } from './common-query.decorator.js';

export function ApiCommonFindOneResource<ODto>(
    resourceName: string, 
    outputDtoClass: new (... args: any[]) => ODto, 
) {
    return applyDecorators(
      ApiOperation({ summary: `Retrieve specified ${resourceName}` }),
      ApiParam({ name: 'slug', description: `Slug of a ${resourceName}` }),
      ApiCommonQueryOneResource(resourceName),
      ApiOkResponse({ type: outputDtoClass, description: `Return ${resourceName} with a specified slug`}),
      ApiNotFoundResponse ({ description: `Not Found: There is no ${resourceName} with a specified slug`})
    );
    
}

export function ApiCommonFindManyResources<ODto>(
    resourceName: string, 
    outputDtoClass: new (... args: any[]) => ODto, 
) {
    return applyDecorators(
      ApiOperation({ summary: `Retrieve many of ${resourceName} objects` }),
      ApiCommonQueryManyResources(resourceName),
      ApiOkResponse({ type: [outputDtoClass], description: `Return many of ${resourceName} object` })
    );
}