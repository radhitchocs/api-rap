import { Body, Controller, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/decorator/response.decorator';
import { IsPublic } from 'src/metadata/metadata/is-public.metadata';
import { AuthService } from 'src/module/auth/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post('login')
  @ResponseMessage('Successfully login!')
  async login(@Body() dto) {
    const result = await this.authService.login(dto);
    return result;
  }
}
