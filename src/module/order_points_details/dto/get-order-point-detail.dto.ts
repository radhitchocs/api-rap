import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class GetOrderPointDetailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  order_id?: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  product_id?: Types.ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  points_earned?: number;
}
