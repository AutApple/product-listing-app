import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStringNumberBoolean(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStringNumberBoolean',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return ['string', 'number', 'boolean'].includes(typeof value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be string, number, or boolean`;
        },
      },
    });
  };
}