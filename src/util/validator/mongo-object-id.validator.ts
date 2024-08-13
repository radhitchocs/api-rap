import { registerDecorator, ValidationOptions } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function IsObjectId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value): boolean {
          return isValidObjectId(value);
        },
        defaultMessage(): string {
          return `${propertyName} must be a mongodb id`;
        },
      },
    });
  };
}
