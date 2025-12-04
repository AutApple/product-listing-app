import { And, Equal, FindOperator, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';
import { FilterEntry, QueryCommonDto } from '../common/dto/query.common.dto.js';
import { FilterType, QueryParserConfiguration } from './types/query-parser-config.type.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';
import { BadRequestException, InternalServerErrorException, Type } from '@nestjs/common';

export interface QueryParserResult {
    selectOptions?: object;
    orderOptions?: object;
    paginationOptions?: {skip: number, take: number};
    filterOptions?: object;
}

export class QueryParser {
    private findSelectOptionsAccum = {};
    private orderOptionsAccum = {};
    private paginationOptions = {};
    private filterOptions = {};

    constructor (private query: QueryCommonDto, private config?: QueryParserConfiguration) {}
    
    // Converts sorting options into TypeORM ordering format
    private sortOptionToKeyValue(sort_option: string): { [key: string]: 'ASC' | 'DESC'} { 
        const isDesc: boolean = (sort_option.charAt(0) === '-');
        const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
        const key: string = isDesc ?  sort_option.slice(1) : sort_option;
        return { [key]: value }
    }
    /**
     * @description converts path like node1.node2.node3 to an object of {node1: {node2: {node3: value}}}
     * @param {string} path - dot-separated path
     * @param {any} value - value to assign to the last node
     * @returns {object} - nested object
     */
    private _makeFieldObject(path: string, value: FindOperator<unknown>): object { 
        const nodes = path.split('.');
        const root = {};
        let currentLevel: any = root;

        nodes.forEach((key, index, arr) => {
            if (index === arr.length - 1) 
                currentLevel[key] = value;
            else{ 
                currentLevel[key] = {}
                currentLevel = currentLevel[key];
            }
        });
        // console.log(root);
        return root; 
    }
    private _validateAndConvertToType(value: string, type: FilterType) : string | number | boolean | undefined{
        function convertToNumber (v: string): number | undefined {
            const num = Number(v);
            if(isNaN(num)) return undefined;
            return num;
        }
        function convertToBool (v: string): boolean | undefined {
            const vL = v.toLowerCase();
            const res = {'false': false, 'true': true};
            if(vL in res)
                return res[vL];
            return undefined;
        }
        const validationConditions = {
            string: (v: string) => v,
            number: (v: string) => convertToNumber(v),
            boolean: (v: string) => convertToBool(v)
        }
        const result = validationConditions[type](value);
        return result;
    }

    private _parseFilterObject(obj: FilterEntry, type: FilterType): FindOperator<unknown>{
        type OperatorFunction = (value: any) => FindOperator<unknown>;
        const ops: Record<string, OperatorFunction>  = {
            'eq': Equal,
            'lt': LessThan,
            'gt': MoreThan,
            'gte': MoreThanOrEqual,
            'lte': LessThanOrEqual
        }
        if(obj.values.length > 1 && obj.operation !== 'eq')
            throw new BadRequestException('Multiple values are not appliable for that operation') //todo: get proper error messages

        // 1. validate and convert
        const values: Array<string | boolean | number | undefined> = obj.values.map(v => this._validateAndConvertToType(v, type));
        const failed = values.some(v => v === undefined);

        if(failed)
            throw new BadRequestException('Wrong type');
        // 2. multiple eq logic
        if(obj.values.length > 1 && obj.operation === 'eq')  
            return In(values);    
        // 3. everything else
        const op = ops[obj.operation];
        if (!op)
            throw new InternalServerErrorException('Unexpected filtering operation. Report this error to the devs');

        return op(values[0]);
    }

    parseFilters() {
        if(!this.query.filters)
            return this;

        for (const key of Object.keys(this.query.filters)) {
            const pathToField: string | undefined = this.config?.filterOptions?.filterQueryMap[key].path;
            const type: FilterType | undefined = this.config?.filterOptions?.filterQueryMap[key].type;
            if(!pathToField || !type) continue; // TODO: non-explicit filtering. for now i'll just do an explicit filtering
            //1. Check if there is multiple values assigned to that key. If yes - start constructing AND.    
            let value: FindOperator<unknown>;
            if(this.query.filters[key].length > 1) 
                value = And(...this.query.filters[key].map((v: FilterEntry) => this._parseFilterObject(v, type)));
            else
                value = this._parseFilterObject(this.query.filters[key][0], type); //otherwise just convert this single value to findOperator
            this.filterOptions = deepMergeObjects(this.filterOptions, this._makeFieldObject(pathToField, value));
        }
     
        return this;
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
        if (Object.keys(this.filterOptions).length > 0) Object.assign(result, {filterOptions: this.filterOptions});

        return result;
    }
}