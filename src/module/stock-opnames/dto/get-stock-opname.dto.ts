import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GetStockOpnameDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warehouse?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;
}
