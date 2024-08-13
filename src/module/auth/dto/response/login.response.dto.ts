import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/module/users/dto/response/user.response.dto';

export class LoginResponseDto {
  @ApiProperty({ name: 'access_token' })
  access_token: string;
  @ApiProperty({ name: 'user' })
  user: UserResponseDto;
}
