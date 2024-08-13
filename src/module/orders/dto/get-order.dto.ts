// src/module/orders/dto/get-order.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class GetOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly customer_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly payment_method_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly payment_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly total?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly created_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly limit?: number;
}