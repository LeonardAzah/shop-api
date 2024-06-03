import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
