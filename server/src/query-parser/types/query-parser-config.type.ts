export enum FilterType {
     STRING = 'string', 
     BOOLEAN = 'boolean',
     NUMBER = 'number'
}

interface FilterMapEntry {
    path: string; // dot-separated path
    type: FilterType; // type of that field
}

interface QueryFilterOptions {
    filterQueryMap: Record<string, FilterMapEntry> // explicitly defined filtering fields
}

export interface QueryParserConfiguration {
    includeMap?: Record<string, object>;
    orderOptions?: string[];
    filterOptions?: QueryFilterOptions;
}