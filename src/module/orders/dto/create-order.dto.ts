// src/module/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  product_id: Types.ObjectId;

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

  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // @Type(() => Number)
  // total: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pay: number;

  // @ApiProperty()
  // @IsNumber()
  // @IsOptional()
  // @Type(() => Number)
  // change?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  qty: number;
}
