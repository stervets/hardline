import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginDto = { phone: number; password: string };

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/auth/login')
  async login(@Body() dto: LoginDto) {
    const token = await this.auth.login(dto.phone, dto.password);
    return { tokenType: 'Bearer', accessToken: token };
  }
}
