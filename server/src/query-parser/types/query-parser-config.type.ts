export enum FieldType {
     STRING = 'string', 
     BOOLEAN = 'boolean',
     NUMBER = 'number',
     COLLECTION = 'collection'
}

interface TypeOrmField {
    path: string; // dot-separated path
    type?: FieldType; // type of that field
}

export interface QueryParserConfiguration {
    fields: Record<string, TypeOrmField | TypeOrmField[]>;
    includeFields?: string[];
    orderFields?: string[];
    filterFields?: string[];
    enableFilterFallbackCollection: boolean;
    searchField?: string; // field slug that would be used for ?search=
}