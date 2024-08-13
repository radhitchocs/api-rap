// src/module/point-settings/dto/create-point-settings.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePointSettingsDto {
  @ApiProperty()
  @IsNumber()
  point_value: number;

  @ApiProperty()
  @IsString()
  earning_criteria: string;
}
