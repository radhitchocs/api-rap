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
  user_id: string;

  @ApiProperty()
  @IsNumber()
  pay: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  change?: number; // Ini akan dihitung berdasarkan total dan pay

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string; // Opsional, bisa ditambahkan jika perlu

  @ApiProperty()
  @IsNumber()
  total_points_earned: number; // Total poin yang diperoleh

  @ApiProperty()
  @IsNumber()
  qty: number;

  @ApiProperty()
  product_id: string;
}
