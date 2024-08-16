import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderPointDto {
  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsString()
  customer_id: string;

  @ApiProperty()
  @IsNumber()
  total_points_earned: number;

  @ApiProperty()
  @IsDateString()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  order_point_details: {
    product_id: string;
    points_earned: number;
  }[];
}
