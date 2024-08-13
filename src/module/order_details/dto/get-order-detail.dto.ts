import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class GetOrderDetailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: Types.ObjectId;
}
