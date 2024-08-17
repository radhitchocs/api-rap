import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderPointDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  order_point_id: Types.ObjectId; // Sesuaikan nama untuk mencerminkan konteks

  @ApiProperty()
  @IsNotEmpty()
  product_id: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  buy: number; // Harga beli produk

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qty: number; // Jumlah produk

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number; // Harga jual per unit

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number; // Total harga (qty * price)
}
