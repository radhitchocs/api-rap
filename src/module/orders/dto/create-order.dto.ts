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
  @IsOptional()
  proof_payment?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  get_point?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  total: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pay: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  change?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [OrderDetailDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @IsArray()
  order_details?: OrderDetailDto[];
}
