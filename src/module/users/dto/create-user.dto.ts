import { IsArray, IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsArray()
  roles: string[];

  @IsString()
  password: string;
}
