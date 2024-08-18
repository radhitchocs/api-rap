import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  order_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  product: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  qty: number;

  @ApiProperty()
  @IsNumber()
  price: number; // harga jual

  @ApiProperty()
  @IsNumber()
  disc: number; // diskon
}
