import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStockOpnameDto {
  @ApiProperty()
  @IsNotEmpty()
  product_id: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouse: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  available: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  difference: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price_value: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch_code: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  with_update?: number; // Default value should be 0 if not provided
}
