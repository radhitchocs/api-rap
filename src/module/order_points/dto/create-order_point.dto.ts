import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderPointDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsString()
  customer_id: string;

  @ApiProperty()
  @IsString()
  user_id: string; // Tambahkan user_id

  @ApiProperty()
  @IsNumber()
  total: number; // Tambahkan total

  @ApiProperty()
  @IsNumber()
  pay: number; // Tambahkan pay

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  change?: number; // Tambahkan change

  @ApiProperty()
  @IsString()
  note: string; // Tambahkan note

  @ApiProperty()
  @IsNumber()
  total_points_earned: number;

  @ApiProperty()
  @IsString()
  product_id: string;
}
