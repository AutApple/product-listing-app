import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ToArray } from '../transformers/to-array.transformer.js';
import { Expose, Transform, Type } from 'class-transformer';
enum SortEnum { created_at_desc ='-createdAt', 
                created_at_asc = 'createdAt',
                updated_at_desc = '-updatedAt',
                updated_at_asc = 'updatedAt' }

export interface FilterEntry {
    key: string;
    values: string[]; 
    operation: string;
}

function transformFlattenedFilters({ obj }: { obj: any }): any {
    const sourceObject = obj;
    const filters: Record <string, Array<FilterEntry>> = {};
    for (const key in sourceObject) {
        const regex = key.match(/filter((?:_(?:lte|gte|gt|lt)))?\[([^\]]+)\]/);
        if(!regex) continue;
        
        let vals: string[]; 
        
        if (Array.isArray(sourceObject[key]))
            vals = sourceObject[key].map((v: string) => v.trim().split(',')).flat();
        else
            vals = sourceObject[key].split(',');

        const resultingObj: FilterEntry = {key: regex[2], values: vals, operation: regex[1]?.slice(1) ?? 'eq'}
        if(!filters[regex[2]]) filters[regex[2]] = [];
        filters[regex[2]].push(resultingObj);
    }
    
    return filters;
}

export class QueryCommonDto {
    @IsOptional()
    @IsNumber({
        allowInfinity: false,
        allowNaN: false
    })
    @Min(0)
    limit?: number;

    @IsOptional()
    @IsNumber({
        allowInfinity: false,
        allowNaN: false
    })
    @Min(0)
    offset?: number;

    @IsOptional()
    @ToArray()
    @IsEnum(SortEnum, {each: true})
    sort?: string[];

    @IsOptional()
    @ToArray()
    include?: string[];
    
    @Expose()
    @IsOptional()
    @Transform(transformFlattenedFilters)
    filters?: Record<string, Array<FilterEntry>>;
}