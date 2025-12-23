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
    showFilteringInfo: boolean = false
) {
    return applyDecorators(
      ApiTags(`${capitalizeString(resourceName)} / Read`),
      ApiOperation({ 
        summary: `Retrieve many of ${resourceName} objects`,
        description: showFilteringInfo ? `
                                            Filtering system

                                            This endpoint supports advanced filtering via query parameters.
        
                                            - Filters are combined using AND (filter_gt[weight]=20&filter[hasNFC]=true)
                                            - Multiple values separated via coma (filter[color]=red,black,white)

                                            Examples:
                                              
                                              ?filter_gte[price]=10&filter_lte[price]=100 
                                              ?filter[category]=books,electronics
                                              ?filter[color]=red
                                               ` : '' 
}),
      ApiCommonQueryManyResources(resourceName),
      ApiOkResponse({ type: [outputDtoClass], description: `Return many of ${resourceName} object` })
    );
}