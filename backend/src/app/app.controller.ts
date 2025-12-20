import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { config } from '../config';
import { type User } from 'src/types';
import { AppService } from 'src/app/app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get()
  index() {
    return `${process.env.PUBLIC_HOST}:${process.env.PUBLIC_PORT}`;
  }

  @UseGuards(JwtGuard)
  @Get('/usersList')
  usersList() {
    return config.store.users;
  }

  @UseGuards(JwtGuard)
  @Post('/addUser')
  addUser(@Req() phone: number, @Body() user: User) {
    //this.jwt.decode(token);
    return phone === config.adminPhone && this.app.addUser(user);
  }
}
