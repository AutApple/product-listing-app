import { And, Equal, FindOperator, FindOptionsOrder, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Raw } from 'typeorm';
import { FilterEntry, QueryCommonDto } from '../common/dto/query.common.dto.js';
import { FieldType, QueryParserConfiguration } from './types/query-parser-config.type.js';
import { deepMergeObjects } from '../common/utils/deep-merge-objects.js';
import { FilterConditionBuilder } from '../common/utils/filter-condition-builder.js';

export interface QueryParserResult {
    selectOptions?: object;
    orderOptions?: object;
    paginationOptions?: { skip: number, take: number; };
    filterOptions?: object;
    filterFallbackCollection?: Record<string, FilterEntry[]>;
}

export class QueryParser {
    private findSelectOptionsAccum = {};
    private orderOptionsAccum = {};
    private paginationOptions = {};
    private filterOptions = {};
    private filterFallbackCollection: Record<string, FilterEntry[]> = {}; // all unrecognized filter keys are stored in this collection

    constructor(private query: QueryCommonDto, private config?: QueryParserConfiguration) { }

    // Converts sorting options into TypeORM ordering format
    private sortOptionToKeyValue(sort_option: string): FindOptionsOrder<unknown> {
        const isDesc: boolean = (sort_option.charAt(0) === '-');
        const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
        const key: string = isDesc ? sort_option.slice(1) : sort_option;
        
        if(!this.config?.orderFields?.find(v => v === key))
            return {};
        if(!this.config.fields[key] || Array.isArray(this.config.fields[key]))
            return {};

        return this.makeFieldObject(this.config.fields[key].path, value);
    }

    /**
     * @description converts path like node1.node2.node3 to an object of {node1: {node2: {node3: value}}}
     * @param {string} path - dot-separated path
     * @param {any} value - value to assign to the last node
     * @returns {object} - nested object
     */
    private makeFieldObject(path: string, value: any): object {
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
        if (!this.query.search || !this.config?.searchField)
            return this;
        
        const searchFieldKey = this.config.searchField;
        const fieldConfig = this.config.fields[searchFieldKey];
        
        if (!fieldConfig || Array.isArray(fieldConfig)) return this;
    
        const whereValue = Raw(
            (alias) => `word_similarity(${alias}, :searchTerm) >= :threshold`,
            {
                searchTerm: this.query.search,
                threshold: 0.3 
            }
        );

        const orderValue = Raw((alias) => `word_similarity(${alias}, :searchTerm) DESC`, {
            searchTerm: this.query.search,
        }) as any;

        const whereOptions = this.makeFieldObject(fieldConfig.path, whereValue);
        const orderOptions = this.makeFieldObject(fieldConfig.path, orderValue);

        this.filterOptions = deepMergeObjects(this.filterOptions, whereOptions);
        this.orderOptionsAccum = deepMergeObjects(this.orderOptionsAccum, orderOptions);

        return this;
    }

    parseFilters() {
        if (!this.query.filters || !this.config?.filterFields)
            return this;

        for (const key of Object.keys(this.query.filters)) { // TODO: check if its a field but not specified in filterFields
            if (Array.isArray(this.config.fields[key])) // skip if specified filter is in not config filter fields or its multiple fields
                continue;
            
            const pathToField: string | undefined = this.config?.fields[key]?.path;
            const type: FieldType | undefined = this.config?.fields[key]?.type;

            if (!pathToField || !type) {
                
                if (this.config.enableFilterFallbackCollection)
                    this.filterFallbackCollection = deepMergeObjects(this.filterFallbackCollection, { [key]: this.query.filters[key] }) as Record<string, FilterEntry[]>;// fallback filtering logic
                continue; 
            }

            let filterConditionBuilder = new FilterConditionBuilder();

            //1. Check if there is multiple values assigned to that key. If yes - start constructing AND.    
            let value: FindOperator<unknown>;
            if (this.query.filters[key].length > 1)
                value = And(...this.query.filters[key].map((v: FilterEntry) => filterConditionBuilder.buildFindOperator(v, type)));
            else
                value = filterConditionBuilder.buildFindOperator(this.query.filters[key][0], type); //otherwise just convert this single value to findOperator
            this.filterOptions = deepMergeObjects(this.filterOptions, this.makeFieldObject(pathToField, value));
        }

        return this;
    }

    parseInclude() {
        if (!this.query.include || !this.config?.includeFields)
            return this;
        for (const includeOption of this.query.include) {
            if(!this.config.fields[includeOption])
                continue;
            let selectOption = {};
            
            if (!Array.isArray(this.config.fields[includeOption]))
                selectOption = this.makeFieldObject(this.config.fields[includeOption].path, true);
            else
                for (const field of this.config.fields[includeOption])
                    selectOption = deepMergeObjects(selectOption, this.makeFieldObject(field.path, true));
            this.findSelectOptionsAccum = deepMergeObjects(this.findSelectOptionsAccum, selectOption);
        }
        return this;
    }

    parseSort() {
        if (!this.query.sort || !this.config?.orderFields)
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
        if (Object.keys(this.filterFallbackCollection).length > 0) Object.assign(result, { filterFallbackCollection: this.filterFallbackCollection });
 
        return result;
    }
}