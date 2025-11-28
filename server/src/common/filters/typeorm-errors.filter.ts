// This filter is used to throw bad request errors on TypeORM errors that are caused by constraints.

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { PostgresErrorCodes } from '../enums/pg-error-codes.enum.js';
import type { Response } from 'express';
import { DatabaseError } from 'pg-protocol';

@Catch(QueryFailedError)
export class TypeORMErrorFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost){

        
        const response: Response = host.switchToHttp().getResponse<Response>();
        
        
        const driverError = exception.driverError as DatabaseError | undefined;
        
        const fallback = () =>
            response.status(500).json({
                message: 'Database query failed',
                detail: driverError?.detail
            });
        
        
        if(!driverError) // Fallback for driverError undefined or not a PG-style error
            return fallback();

        switch(driverError.code) {
            case PostgresErrorCodes.UniqueViolation:
                return response.status(409).json({
                    message: 'Unique constraint violation',
                    detail: driverError.detail
                });
        }
        
        return fallback();
    }
}
