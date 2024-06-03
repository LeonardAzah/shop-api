import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('CM')
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
