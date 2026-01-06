import { Equal, FindOperator, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';
import { FieldType } from '../../config/interfaces/query-parser-config.interface.js';
import { FilterEntry } from '../dto/query.common.dto.js';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';

export class FilterConditionBuilder {
    public convertToType(value: string, type: FieldType): string | number | boolean | undefined {
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
        
            const conversion = {
                string: (v: string) => v,
                number: (v: string) => convertToNumber(v),
                boolean: (v: string) => convertToBool(v)
            }
            const result = conversion[type](value);
            return result;
    }
    
    /**
     * @description Builds TypeORM find operator (e.g. Equal, LessThan, MoreThan ...) for a value that is being held within query FilterEntry.
     */
     public buildFindOperator(obj: FilterEntry, type: FieldType): FindOperator<unknown>{
            type OperatorFunction = (value: any) => FindOperator<unknown>;
            const ops: Record<string, OperatorFunction>  = {
                'eq': Equal,
                'lt': LessThan,
                'gt': MoreThan,
                'gte': MoreThanOrEqual,
                'lte': LessThanOrEqual
            }
            if(obj.values.length > 1 && obj.operation !== 'eq') // Multiple values for non-eq operations are forbidden
                throw new BadRequestException(ERROR_MESSAGES.FILTER_WRONG_SIGNATURE(obj.key)) 
            if (obj.operation !== 'eq' && type !== FieldType.NUMBER) // Numeric comparasion on non-numeric values is forbidden
                throw new BadRequestException(ERROR_MESSAGES.FILTER_WRONG_SIGNATURE(obj.key))
            // 1. convert
            const values: Array<string | boolean | number | undefined> = obj.values.map(v => this.convertToType(v, type));
            
            //2. validate
            const failed = values.some(v => v === undefined);
    
            if(failed)
                throw new BadRequestException(ERROR_MESSAGES.FILTER_WRONG_TYPE(obj.key, type));
            
            // 3. multiple eqs logic
            if(obj.values.length > 1 && obj.operation === 'eq')  
                return In(values);    
            
            // 4. everything else
            const op = ops[obj.operation];
            if (!op)
                throw new InternalServerErrorException(ERROR_MESSAGES.UNEXPECTED('building where clause from filter'));
    
            return op(values[0]);
    }
    


}