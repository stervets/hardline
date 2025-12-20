import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type User } from 'src/types';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/auth/login')
  async login(@Body() [phone, password]: [number, string]) {
    return await this.auth.login(Number(phone), password);

    //const token = await this.auth.login(dto.phone, dto.password);
    //return { tokenType: 'Bearer', accessToken: token };
  }
}
