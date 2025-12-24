// This filter is used to throw bad request errors on TypeORM errors that are caused by constraints.

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { PostgresErrorCodes } from '../enums/pg-error-codes.enum.js';
import type { Response } from 'express';
import { DatabaseError } from 'pg-protocol';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';

@Catch(QueryFailedError)
export class TypeORMErrorFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const response: Response = host.switchToHttp().getResponse<Response>();

        const driverError = exception.driverError as DatabaseError | undefined;

        const fallback = () =>
            response.status(500).json({
                message: ERROR_MESSAGES.DB_ERROR_GENERAL,
                detail: driverError?.detail
            });


        if (!driverError) // Fallback for driverError undefined or not a PG-style error
            return fallback();

        switch (driverError.code) {
            case PostgresErrorCodes.UniqueViolation:
                // HTTP 409 Conflict: resource already exists
                return response.status(409).json({
                    message: ERROR_MESSAGES.DB_UNIQUE_CONSTRAINT_VIOLATION(), // no internal value
                });

            case PostgresErrorCodes.ForeignKeyViolation:
                // HTTP 400 Bad Request: invalid reference
                return response.status(400).json({
                    message: ERROR_MESSAGES.DB_FOREIGN_KEY_VIOLATION(),
                });

            case PostgresErrorCodes.NotNullViolation:
                // HTTP 400 Bad Request: missing required field
                return response.status(400).json({
                    message: ERROR_MESSAGES.DB_NOT_NULL_VIOLATION(),
                });

            case PostgresErrorCodes.CheckViolation:
                // HTTP 400 Bad Request: invalid value
                return response.status(400).json({
                    message: ERROR_MESSAGES.DB_ERROR_GENERAL(),
                });

            case PostgresErrorCodes.StringDataRightTruncation:
                // HTTP 400 Bad Request: value too long
                return response.status(400).json({
                    message: ERROR_MESSAGES.DB_STRING_DATA_TRUNCATION(),
                });

            default:
                // HTTP 500 Internal Server Error: generic fallback
                return response.status(500).json({
                    message: ERROR_MESSAGES.UNEXPECTED(`sql problem ${driverError.detail}`), // detail is only exposed in the console (logging from ERROR_MESSAGES.UNEXPECTED)
                });
        }

        return fallback();
    }
}
