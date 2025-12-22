import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiCommonQueryManyResources, ApiCommonQueryOneResource } from './common-query.decorator.js';
import { capitalizeString } from '../utils/capitalizeString.js';

export function ApiCommonFindOneResource<ODto>(
    resourceName: string, 
    outputDtoClass: new (... args: any[]) => ODto,
    identity: string = 'slug'
) {
    return applyDecorators(
      ApiTags(`${capitalizeString(resourceName)} / Read`),
      ApiOperation({ summary: `Retrieve specified ${resourceName}` }),
      ApiParam({ name: `${identity}`, description: `${capitalizeString(identity)} of a ${resourceName}` }),
      ApiCommonQueryOneResource(resourceName),
      ApiOkResponse({ type: outputDtoClass, description: `Return ${resourceName} with a specified ${identity}`}),
      ApiNotFoundResponse ({ description: `Not Found: There is no ${resourceName} with a specified ${identity}`})
    );
    
}

export function ApiCommonFindManyResources<ODto>(
    resourceName: string, 
    outputDtoClass: new (... args: any[]) => ODto, 
) {
    return applyDecorators(
      ApiTags(`${capitalizeString(resourceName)} / Read`),
      ApiOperation({ summary: `Retrieve many of ${resourceName} objects` }),
      ApiCommonQueryManyResources(resourceName),
      ApiOkResponse({ type: [outputDtoClass], description: `Return many of ${resourceName} object` })
    );
}