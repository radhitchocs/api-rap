import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class GetCustomerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly loyalty_points?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly created_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly updated_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly limit?: number;
}
