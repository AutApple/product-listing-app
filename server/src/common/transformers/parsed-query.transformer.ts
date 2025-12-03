import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { QueryCommonDto } from '../dto/query.common.dto.js';
import { plainToInstance } from 'class-transformer';
import { QueryParser } from '../utils/query-parser.js';
import { QueryParserConfiguration } from '../interfaces/query-parser-config.type.js';


// This decorator gets raw query and then parses it into the format that is feasable for services (various TypeORM options)
export const ParsedQuery = createParamDecorator((data: {config: QueryParserConfiguration, dto: Type<any>}, ctx: ExecutionContext) => {
    const { config, dto } = data;
    const request = ctx.switchToHttp().getRequest();
    const rawQuery = request.query;

    // 1. dto transformation - get the raw query and try to convert it into actual dto
    const transformedQuery: QueryCommonDto = plainToInstance(dto, rawQuery, {
        enableImplicitConversion: true,
        exposeUnsetFields: false
    });
    //2. validate - TODO
    console.log(transformedQuery);
    //3. parsing logic
    const parsedQuery = new QueryParser(transformedQuery, config).parseInclude()
                                                                 .parsePagination()
                                                                 .parseSort()
                                                                 .build();

    return parsedQuery;

});