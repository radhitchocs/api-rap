import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class GetOrderPointDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  order_id?: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  customer_id?: Types.ObjectId;
}
