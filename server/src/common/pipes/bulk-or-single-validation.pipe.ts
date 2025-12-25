import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../config/error-messages.config.js';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class BulkOrSingleValidationPipe<T> implements PipeTransform<any> {
    constructor(private readonly dtoClass: new () => T) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value)
            throw new BadRequestException(ERROR_MESSAGES.NO_DATA_PROVIDED());

        const isArray = Array.isArray(value);
        const objectsToValidate: T[] = isArray ? plainToInstance(this.dtoClass, value) : [plainToInstance(this.dtoClass, value)];

        for (const obj of objectsToValidate) {
            const errors = await validate(obj as any);
            if (errors.length > 0) {
                const messages = this.extractMessages(errors);
                throw new BadRequestException({
                    message: ERROR_MESSAGES.RESOURCE_VALIDATION_FAIL(),
                    errors: messages,
                });
            }
        }

        return isArray ? objectsToValidate : objectsToValidate[0];
    }

    private extractMessages(errors: ValidationError[]): string[] {
        const result: string[] = [];

        const walk = (errs: ValidationError[]) => {
            for (const err of errs) {
                if (err.constraints) {
                    result.push(...Object.values(err.constraints));
                }
                if (err.children?.length) {
                    walk(err.children);
                }
            }
        };

        walk(errors);
        return result;
    }
}
