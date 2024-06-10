import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { IsPassword } from '../../../common/decorators/validators/is-password.decorator';

export class CreateUserDto {
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('CM')
  phone: string;

  /**
   * Requires:
   * 1. 8 to 20 characters
   * 2. At least one
   * - Lowercase letter
   * - Uppercase letter
   * - Number
   * - Special character
   */
  @IsPassword()
  password: string;
}
