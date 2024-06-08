import { IsEmail } from 'class-validator';
import { IsPassword } from '../../common/decorators/validators/is-password.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;
}
