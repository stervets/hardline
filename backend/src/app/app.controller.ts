import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller()
export class AppController {
  @Get()
  index() {
    return `${process.env.PUBLIC_HOST}:${process.env.PUBLIC_PORT}`;
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  me(@Req() req: any) {
    return { phone: req.user.phone };
  }
}
