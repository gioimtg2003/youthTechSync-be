import {
  ActionPermission,
  SYSTEM_RESOURCE_AVAILABLE_FOR_PERMISSION,
} from '@constants';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

class IsActionConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!Object.keys(ActionPermission).includes(value)) return false;

    return true;
  }
}

class IsResourceConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    console.log('🚀 ~ IsResourceConstraint ~ validate ~ value:', value);
    if (!SYSTEM_RESOURCE_AVAILABLE_FOR_PERMISSION.includes(value)) return false;

    return true;
  }
}

export function IsActionPolicy(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isActionPolicy',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsActionConstraint,
    });
  };
}

export function IsResourcePolicy(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isResourcePolicy',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsResourceConstraint,
    });
  };
}
