import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreatePrinterSettingsDto {
  @ApiProperty()
  @IsString()
  ip: string; // Alamat IP printer

  @ApiProperty()
  @IsString()
  name: string; // Nama printer

  @ApiProperty()
  @IsBoolean()
  is_active: boolean; // Status printer
}
