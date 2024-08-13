import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPaymentMethodDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string; // optional field for search queries
}
