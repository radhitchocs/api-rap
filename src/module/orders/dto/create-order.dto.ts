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
  customer: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  product?: Types.ObjectId;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  payment_method: string;

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

  @ApiProperty()
  batch_code: string;
}
