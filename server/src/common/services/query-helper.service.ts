import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryHelperService {
    // Convert sorting options into TypeORM ordering format
    sortOptionToKeyValue(sort_option: string): { [key: string]: 'ASC' | 'DESC'} { 
        const isDesc: boolean = (sort_option.charAt(0) === '-');
        const value: 'ASC' | 'DESC' = isDesc ? 'DESC' : 'ASC';
        const key: string = isDesc ?  sort_option.slice(1) : sort_option;
        return { [key]: value }
    }
}