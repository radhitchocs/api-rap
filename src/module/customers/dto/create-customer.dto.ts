import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  loyalty_points?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  updated_at?: Date;
}
