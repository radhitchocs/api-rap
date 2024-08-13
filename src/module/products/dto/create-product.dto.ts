import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  buy_price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sell_price: number;

  @ApiPropertyOptional()
  @IsOptional()
  promo?: {
    is_promo: boolean;
    promo_price: number;
  };

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  loyalty_points: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  updated_at: Date;
}
