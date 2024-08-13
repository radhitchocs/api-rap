import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
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
  available_quantity: number;

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
  @IsDateString()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch_code: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  is_active?: boolean;
}
