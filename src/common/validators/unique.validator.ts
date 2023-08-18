import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection } from 'mongoose';

/**
 * Implement a validator to check unicity in the database
 *
 * @example
 *
 * @Validate(IsUniqueValidator, [User, 'email'], {
 *   message: 'Email $value already in use',
 * })
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueValidator implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    try {
      const findBy = { [args.constraints[1]]: value };
      const result = await this.connection.models[args.constraints[0].name]
        .find(findBy)
        .collation({ locale: 'en', strength: 2 });

      return result.length < 1;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} field must refer to existing ${args.constraints[0].name} document`;
  }
}
