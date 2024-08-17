import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePointSettingsDto {
  @ApiProperty()
  @IsNumber()
  point: number; // Ganti point_value dengan point

  @ApiProperty()
  @IsString()
  every: string; // Ganti earning_criteria dengan every
}
