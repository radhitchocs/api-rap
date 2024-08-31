import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  @Type(() => Number)
  buy_price: number;

  @ApiProperty()
  @Type(() => Number)
  sell_price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_promo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  user_id?: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch_code: string;
}
