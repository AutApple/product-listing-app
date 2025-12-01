import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ToArray } from '../transformers/to-array.transformer.js';
enum SortEnum { created_at_desc ='-createdAt', 
                created_at_asc = 'createdAt',
                updated_at_desc = '-updatedAt',
                updated_at_asc = 'updatedAt' }
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
 
}