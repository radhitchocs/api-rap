import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class GetProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  updated_at?: Date;
}
