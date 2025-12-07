import { And, Equal, FindOperator, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Raw } from 'typeorm';
import { FilterEntry, QueryCommonDto } from '../common/dto/query.common.dto.js';
import { FilterType, QueryParserConfiguration } from './types/query-parser-config.type.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';
import { FilterConditionBuilder } from '../common/utils/filter-condition-builder.js';

export interface QueryParserResult {
    selectOptions?: object;
    orderOptions?: object;
    paginationOptions?: { skip: number, take: number; };
    filterOptions?: object;
    filterFallbackCollection?: Array<{ [key: string]: FilterEntry[]; }>;
}

export class QueryParser {
    private findSelectOptionsAccum = {};
    private orderOptionsAccum = {};
    private paginationOptions = {};
    private filterOptions = {};
    private filterFallbackCollection: Array<{ [key: string]: FilterEntry[]; }> = []; // all unrecognized filter keys are stored in this collection

    constructor(private query: QueryCommonDto, private config?: QueryParserConfiguration) { }

    // Converts sorting options into TypeORM ordering format
    private sortOptionToKeyValue(sort_option: string): { [key: string]: 'ASC' | 'DESC'; } {
        const isDesc: boolean = (sort_option.charAt(0) === '-');
        const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
        const key: string = isDesc ? sort_option.slice(1) : sort_option;
        return { [key]: value };
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
            else {
                currentLevel[key] = {};
                currentLevel = currentLevel[key];
            }
        });
        return root;
    }

    parseSearchString() {
        if (!this.query.search || !this.config?.searchFieldPath)
            return this;
        const whereValue = Raw(
            (alias) => `similarity(${alias}, :searchTerm) >= :threshold`,
            {
                searchTerm: this.query.search,
                threshold: 0.01 
            }
        );

        const orderValue = Raw((alias) => `similarity(${alias}, :searchTerm) DESC`, {
            searchTerm: this.query.search,
        }) as any;
        
        const whereOptions = this._makeFieldObject(this.config.searchFieldPath, whereValue);
        const orderOptions = this._makeFieldObject(this.config.searchFieldPath, orderValue);

        this.filterOptions = deepMergeObjects(this.filterOptions, whereOptions);
        this.orderOptionsAccum = deepMergeObjects(this.orderOptionsAccum, orderOptions);

        return this;
    }

    parseFilters() {
        if (!this.query.filters)
            return this;

        for (const key of Object.keys(this.query.filters)) {
            const pathToField: string | undefined = this.config?.filterOptions?.filterQueryMap[key]?.path;
            const type: FilterType | undefined = this.config?.filterOptions?.filterQueryMap[key]?.type;
            if (!pathToField || !type) {
                if (this.config?.filterOptions?.enableFallbackCollection)
                    this.filterFallbackCollection.push({ [key]: this.query.filters[key] });// fallback filtering logic
                continue; // TODO: non-explicit filtering. for now i'll just do an explicit filtering
            }

            let filterConditionBuilder = new FilterConditionBuilder();

            //1. Check if there is multiple values assigned to that key. If yes - start constructing AND.    
            let value: FindOperator<unknown>;
            if (this.query.filters[key].length > 1)
                value = And(...this.query.filters[key].map((v: FilterEntry) => filterConditionBuilder.buildFindOperator(v, type)));
            else
                value = filterConditionBuilder.buildFindOperator(this.query.filters[key][0], type); //otherwise just convert this single value to findOperator
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
        if (this.query.offset) Object.assign(this.paginationOptions, { skip: this.query.offset });
        if (this.query.limit) Object.assign(this.paginationOptions, { take: this.query.limit });
        return this;
    }

    build(): QueryParserResult {
        const result: QueryParserResult = {};

        if (Object.keys(this.findSelectOptionsAccum).length > 0) Object.assign(result, { selectOptions: this.findSelectOptionsAccum });
        if (Object.keys(this.orderOptionsAccum).length > 0) Object.assign(result, { orderOptions: this.orderOptionsAccum });
        if (Object.keys(this.paginationOptions).length > 0) Object.assign(result, { paginationOptions: this.paginationOptions });
        if (Object.keys(this.filterOptions).length > 0) Object.assign(result, { filterOptions: this.filterOptions });
        if (this.filterFallbackCollection.length > 0) Object.assign(result, { filterFallbackCollection: this.filterFallbackCollection });
        return result;
    }
}