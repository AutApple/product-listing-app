import { Type } from '@nestjs/common';

interface FilterQueryMapEntry {
    path: string; // dot-separated path
    type: 'string' | 'boolean' | 'number'; // type of that field
}

interface QueryFilterOptions {
    filterQueryMap: Record<string, FilterQueryMapEntry> // explicitly defined filtering fields
}

export interface QueryParserConfiguration {
    includeMap?: Record<string, object>;
    orderOptions?: string[];
    filterOptions?: QueryFilterOptions;
}