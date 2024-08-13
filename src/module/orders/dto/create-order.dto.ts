// src/module/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDetailDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  payment_method_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @ApiProperty({ type: [OrderDetailDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @IsArray()
  @IsNotEmpty()
  order_details: OrderDetailDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  created_at?: string;
}
