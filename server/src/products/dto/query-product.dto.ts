import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { QueryCommonDto } from '../../common/dto/query.common.dto.js';
import { ToArray } from '../../common/transformers/to-array.transformer.js';

enum SortEnum { created_at_desc ='-createdAt', 
                created_at_asc = 'createdAt',
                updated_at_desc = '-updatedAt',
                updated_at_asc = 'updatedAt' }


export class QueryProductDto extends QueryCommonDto {
    @IsOptional()
    @ToArray()
    @IsEnum(SortEnum, {each: true})
    sort: string[];
}   