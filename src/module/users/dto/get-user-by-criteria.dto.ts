import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetUserByCriteriaDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
