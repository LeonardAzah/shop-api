import { applyDecorators } from '@nestjs/common';
import { ValidationOptions, IsNumber, IsPositive } from 'class-validator';

/**
 * Checks if a value is a number.
 *
 */
export const IsCurrency = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(
    IsNumber({ maxDecimalPlaces: 2 }, validationOptions),
    IsPositive(validationOptions),
  );
