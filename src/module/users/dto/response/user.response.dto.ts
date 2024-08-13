import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose({ name: 'name', toPlainOnly: true })
  @ApiProperty({ name: 'name' })
  name: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ name: 'email' })
  email: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({ name: 'username' })
  username: string;

  @Exclude({ toPlainOnly: true })
  password: string;
}
