import { QueryCommonDto } from '../dto/query.common.dto.js';
import { QueryParserConfiguration } from '../interfaces/query-parser-config.type.js';
import { deepMergeObjects } from './deep-merge-objects.js';

export interface QueryParserResult {
    selectOptions?: object;
    orderOptions?: object;
    paginationOptions?: object;
}

export class QueryParser {
    private findSelectOptionsAccum = {};
    private orderOptionsAccum = {};
    private paginationOptions = {};

    constructor (private query: QueryCommonDto, private config?: QueryParserConfiguration) {}
    
    // Converts sorting options into TypeORM ordering format
    private sortOptionToKeyValue(sort_option: string): { [key: string]: 'ASC' | 'DESC'} { 
        const isDesc: boolean = (sort_option.charAt(0) === '-');
        const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
        const key: string = isDesc ?  sort_option.slice(1) : sort_option;
        return { [key]: value }
    }
    
    parseInclude() { 
        if (!this.query.include || !this.config?.includeMap) 
            return this;
        for (const includeOption of this.query.include) {
            const selectOption = this.config.includeMap[includeOption]; 
            if (!selectOption) continue;
            this.findSelectOptionsAccum = deepMergeObjects(this.findSelectOptionsAccum, selectOption);
        }
        return this;
    }

    parseSort() {
        if (!this.query.sort || !this.config?.orderOptions)
            return this; 
        for (const s of this.query.sort)
            this.orderOptionsAccum = deepMergeObjects(this.orderOptionsAccum, this.sortOptionToKeyValue(s));
        return this;
    }

    parsePagination() {
        if (this.query.offset) Object.assign(this.paginationOptions, {skip: this.query.offset});
        if (this.query.limit) Object.assign(this.paginationOptions, {take: this.query.limit});
        return this; 
    }

    build(): QueryParserResult {
        const result: QueryParserResult = {};
        if (Object.keys(this.findSelectOptionsAccum).length > 0) Object.assign(result, {selectOptions: this.findSelectOptionsAccum})
        if (Object.keys(this.orderOptionsAccum).length > 0) Object.assign(result, {orderOptions: this.orderOptionsAccum})
        if (Object.keys(this.paginationOptions).length > 0) Object.assign(result, {paginationOptions: this.paginationOptions})
        


        return result;
    }

}