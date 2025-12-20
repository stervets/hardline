import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Request, type User } from 'src/types';
import { JwtGuard } from 'src/auth/jwt.guard';
import { config } from 'src/config';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/auth/login')
  login(@Body() [phone, password]: [number, string]) {
    return this.auth.login(phone, password);

    //const token = await this.auth.login(dto.phone, dto.password);
    //return { tokenType: 'Bearer', accessToken: token };
  }

  @UseGuards(JwtGuard)
  @Post('/auth/refreshToken')
  usersList(@Req() { user }: Request) {
    return this.auth.refreshToken(user);
  }
}
