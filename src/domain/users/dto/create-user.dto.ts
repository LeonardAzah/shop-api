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

  @IsPassword()
  password: string;
}
