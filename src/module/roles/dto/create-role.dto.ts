import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  permissions: string[];

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
