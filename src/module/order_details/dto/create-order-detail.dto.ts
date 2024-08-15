import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  orderId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  discount: number;
}
