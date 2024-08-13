import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderPointDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  order_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  product_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  points_earned: number;
}
