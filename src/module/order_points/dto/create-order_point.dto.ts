import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderPointDto {
  @ApiProperty()
  @IsObject()
  order_id: Types.ObjectId;

  @ApiProperty()
  @IsObject()
  customer_id: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  total_points_earned: number;

  @ApiProperty()
  @IsDateString()
  created_at: Date;

  @ApiProperty()
  @IsNotEmpty()
  order_point_details: {
    product_id: Types.ObjectId;
    points_earned: number;
  }[];
}
