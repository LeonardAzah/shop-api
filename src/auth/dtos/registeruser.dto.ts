import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
