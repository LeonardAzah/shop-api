import { ValidationOptions } from 'class-validator';
import { buildMessage, ValidateBy, matches } from 'class-validator';

const PASSWORD_REGEX = /.*[A-Z].*/;

const AT_LEAST_ONE_UPPERCASE_LETTER_KEY = 'atLeastOneUppercaseLetter';

const atLeastOneUppercaseLetter = (value: string): boolean => {
  return matches(value, PASSWORD_REGEX);
};

export const AtLeastOneUppercaseLetter = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  ValidateBy(
    {
      name: AT_LEAST_ONE_UPPERCASE_LETTER_KEY,
      validator: {
        validate: (value): boolean => atLeastOneUppercaseLetter(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must contain at least one uppercase letter',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
