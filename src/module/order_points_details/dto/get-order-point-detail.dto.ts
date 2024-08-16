import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetOrderPointDetailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  order_point_id?: string;
}
